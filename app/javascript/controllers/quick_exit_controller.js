import { Controller } from "@hotwired/stimulus"

const SAFE_URL = "https://www.google.com/search?q=weather+today"

export default class extends Controller {
  connect() {
    console.log("%c[GBV Support] Quick Exit is ready. Press Esc to leave the site.",
                "color:#dc3545;font-weight:bold")
  }

  key(event) {
    const dialogIsOpen = document.querySelector("dialog[open]") !== null

    if (event.key === "Escape" && !dialogIsOpen) {
      this.leave()
    }
  }

  leave() {
    console.warn("[GBV Support] Quick Exit used, leaving the site.")
    window.location.replace(SAFE_URL)
  }
}
