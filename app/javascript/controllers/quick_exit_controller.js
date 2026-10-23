// Lab 3: Quick Exit (keyboard event + button click)
//
// Many domestic violence websites have a "Quick Exit" button. If the abuser
// walks into the room, the visitor can press Esc or click the button and
// the browser jumps to a harmless website straight away.
import { Controller } from "@hotwired/stimulus"

const SAFE_URL = "https://www.google.com/search?q=weather+today"

export default class extends Controller {
  connect() {
    // Output method 4: console
    console.log("%c[GBV Support] Quick Exit is ready. Press Esc to leave the site.",
                "color:#dc3545;font-weight:bold")
  }

  // data-action="keydown@window->quick-exit#key"
  key(event) {
    // Logical operators: only react to Esc, and not while a popup dialog is
    // open (inside a dialog, Esc should just close the dialog).
    const dialogIsOpen = document.querySelector("dialog[open]") !== null

    if (event.key === "Escape" && !dialogIsOpen) {
      this.leave()
    }
  }

  // data-action="quick-exit#leave"
  leave() {
    console.warn("[GBV Support] Quick Exit used, leaving the site.")
    // replace() also removes this page from the Back button history
    window.location.replace(SAFE_URL)
  }
}
