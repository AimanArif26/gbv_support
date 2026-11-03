import { Controller } from "@hotwired/stimulus"
import { malaysiaHour, formatShortTime, formatLongDateTime, hourLabel } from "lib/time_helpers"

export default class extends Controller {
  static targets = ["line", "updated", "preview", "previewFrame"]

  connect() {
    this.updateStatus()
    this.timer = setInterval(() => this.updateStatus(), 60 * 1000)

    console.info("[Hotline] Support lines on this page:")
    console.table(this.hotlines.map(({ name, number, hours }) => ({ name, number, hours })))
  }

  disconnect() {
    clearInterval(this.timer)
  }

  get hotlines() {
    return this.lineTargets.map((element) => {
      const { name, number, open, close } = element.dataset
      const hasHours = open !== undefined && close !== undefined

      return {
        element,
        name,
        number,
        open: hasHours ? Number(open) : null,
        close: hasHours ? Number(close) : null,
        hours: !hasHours ? "See website"
             : Number(open) === 0 && Number(close) === 24 ? "24 hours"
             : `${hourLabel(Number(open))} to ${hourLabel(Number(close))}`
      }
    })
  }

  updateStatus() {
    const now = new Date()
    const hour = malaysiaHour(now)

    for (const line of this.hotlines) {
      const badge = line.element.querySelector("[data-role='status']")
      const status = this.statusFor(line, hour)

      badge.className = `badge ms-1 ${status.css}`
      badge.innerHTML = status.text
    }

    this.updatedTarget.innerHTML =
      `Opening hours checked at <strong>${formatShortTime(now)}</strong> Malaysia time. ` +
      `Badges update every minute.`
  }

  statusFor(line, hour) {
    if (line.open === null) {
      return { text: "Check hours on website", css: "text-bg-secondary" }
    } else if (line.open === 0 && line.close === 24) {
      return { text: "Open 24 hours", css: "text-bg-success" }
    } else if (hour >= line.open && hour < line.close) {
      return { text: `Open now, until ${hourLabel(line.close)}`, css: "text-bg-success" }
    } else {
      return { text: `Closed now, opens ${hourLabel(line.open)}`, css: "text-bg-secondary" }
    }
  }

  async copy({ params: { name, number } }) {
    try {
      await this.copyText(number)
      window.alert(`${name} number ${number} copied. You can paste it into your phone or notes.`)
      console.log(`[Hotline] Copied ${name}: ${number}`)
    } catch (error) {
      console.error("[Hotline] Could not copy:", error)
      window.alert(`Sorry, the number could not be copied. Please write it down: ${number}`)
    }
  }

  async copyText(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const box = document.createElement("textarea")
      box.value = text
      box.style.position = "fixed"
      box.style.opacity = "0"
      document.body.append(box)
      box.select()
      const copied = document.execCommand("copy")
      box.remove()
      if (!copied) throw new Error("Copy was blocked by the browser")
    }
  }

  printCard() {
    const cardWindow = window.open("", "_blank", "width=480,height=640")

    if (cardWindow) {
      this.writeCard(cardWindow.document)
      console.log("[Hotline] Safety card opened in a new window with document.write().")
    } else {
      console.warn("[Hotline] Popup blocked. Showing the safety card on the page instead.")
      this.previewTarget.classList.remove("d-none")
      this.writeCard(this.previewFrameTarget.contentDocument)
      this.previewTarget.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  closePreview() {
    this.previewTarget.classList.add("d-none")
  }

  writeCard(doc) {
    let rows = ""
    for (const line of this.hotlines) {
      rows += `<tr><td>${line.name}</td><td><b>${line.number}</b></td><td>${line.hours}</td></tr>`
    }

    doc.open()
    doc.write(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <title>My Safety Card</title>
        <style>
          body  { font-family: Arial, sans-serif; margin: 16px; color: #212529; }
          .card { border: 3px solid #dc3545; border-radius: 12px; padding: 16px; max-width: 440px; }
          h1    { color: #dc3545; font-size: 22px; margin: 0 0 4px; }
          .big  { font-size: 40px; font-weight: bold; color: #dc3545; margin: 4px 0 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          td    { border-bottom: 1px solid #ddd; padding: 6px 4px; }
          small { color: #6c757d; }
          button { margin-top: 12px; padding: 8px 16px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>My Safety Card</h1>
          <small>GBV Support MY</small>
          <p>In immediate danger, call:</p>
          <div class="big">999</div>
          <table>${rows}</table>
          <p><small>Made on ${formatLongDateTime(new Date())}.
             Keep this card somewhere safe. Numbers can change, so check the official websites.</small></p>
        </div>
        <button onclick="window.print()">Print this card</button>
      </body>
      </html>`)
    doc.close()
  }
}
