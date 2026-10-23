// Lab 3: Show / hide the password on the login page
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "button"]

  toggle() {
    // Ternary operator switches between "password" (hidden) and "text" (shown)
    const hidden = this.inputTarget.type === "password"
    this.inputTarget.type = hidden ? "text" : "password"
    this.buttonTarget.innerHTML = hidden ? "Hide" : "Show"   // innerHTML
  }
}
