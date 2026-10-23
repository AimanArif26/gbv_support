// Lab 3: Hotline page
//
//  - "Open now" badges worked out from the current Malaysia time
//    (date and time handling + if / else + comparison operators)
//  - setInterval() re-checks the badges every minute (event loop)
//  - "Copy" buttons copy a number and confirm with window.alert()
//  - "Print my safety card" opens a new window and builds it with document.write()
//    (if the browser blocks popups, the card is written into a frame on the page)
//  - console.table() lists every hotline in the browser console
import { Controller } from "@hotwired/stimulus"
import { malaysiaHour, formatShortTime, formatLongDateTime, hourLabel } from "lib/time_helpers"

export default class extends Controller {
  static targets = ["line", "updated", "preview", "previewFrame"]

  connect() {
    this.updateStatus()
    this.timer = setInterval(() => this.updateStatus(), 60 * 1000)   // every minute

    // Output method 4: console
    console.info("[Hotline] Support lines on this page:")
    console.table(this.hotlines.map(({ name, number, hours }) => ({ name, number, hours })))
  }

  disconnect() {
    clearInterval(this.timer)
  }

  // Reads every hotline from the data attributes in hotline.html.erb
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

  // ---------- Open / closed badges ----------
  updateStatus() {
    const now = new Date()
    const hour = malaysiaHour(now)

    for (const line of this.hotlines) {
      const badge = line.element.querySelector("[data-role='status']")
      const status = this.statusFor(line, hour)

      badge.className = `badge ms-1 ${status.css}`
      badge.innerHTML = status.text                 // Output method 1: innerHTML
    }

    this.updatedTarget.innerHTML =
      `Opening hours checked at <strong>${formatShortTime(now)}</strong> Malaysia time. ` +
      `Badges update every minute.`
  }

  // Control statements decide which badge to show
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

  // ---------- Copy a number ----------
  // Button: data-action="hotline#copy" data-hotline-number-param="15999"
  async copy({ params: { name, number } }) {
    try {
      await this.copyText(number)
      // Output method 3: window.alert()
      window.alert(`${name} number ${number} copied. You can paste it into your phone or notes.`)
      console.log(`[Hotline] Copied ${name}: ${number}`)
    } catch (error) {
      // Error handling: the clipboard can be blocked by the browser
      console.error("[Hotline] Could not copy:", error)
      window.alert(`Sorry, the number could not be copied. Please write it down: ${number}`)
    }
  }

  // Tries the modern Clipboard API first, then an older method as a backup
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

  // ---------- Printable safety card ----------
  printCard() {
    const cardWindow = window.open("", "_blank", "width=480,height=640")

    if (cardWindow) {
      this.writeCard(cardWindow.document)
      console.log("[Hotline] Safety card opened in a new window with document.write().")
    } else {
      // Error handling: the popup was blocked, so show the card on this page instead
      console.warn("[Hotline] Popup blocked. Showing the safety card on the page instead.")
      this.previewTarget.classList.remove("d-none")
      this.writeCard(this.previewFrameTarget.contentDocument)
      this.previewTarget.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  closePreview() {
    this.previewTarget.classList.add("d-none")
  }

  // Builds the safety card page inside the given document
  writeCard(doc) {
    let rows = ""
    for (const line of this.hotlines) {
      rows += `<tr><td>${line.name}</td><td><b>${line.number}</b></td><td>${line.hours}</td></tr>`
    }

    doc.open()
    // Output method 2: document.write() builds the whole page
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
