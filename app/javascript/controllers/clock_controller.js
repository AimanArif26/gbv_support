import { Controller } from "@hotwired/stimulus"
import { malaysiaHour, formatLongDateTime, formatShortTime } from "lib/time_helpers"

export default class extends Controller {
  static targets = ["time", "greeting"]
  static values = { format: { type: String, default: "long" } }

  connect() {
    this.tick()
    this.timer = setInterval(() => this.tick(), 1000)
  }

  disconnect() {
    clearInterval(this.timer)
  }

  tick() {
    const now = new Date()

    if (this.hasTimeTarget) {
      this.timeTarget.innerHTML = this.formatValue === "short"
        ? `<strong>${formatShortTime(now)}</strong>`
        : `Malaysia time: <strong>${formatLongDateTime(now)}</strong>`
    }

    if (this.hasGreetingTarget) {
      this.greetingTarget.innerHTML = this.greetingFor(malaysiaHour(now))
    }
  }

  greetingFor(hour) {
    if (hour >= 5 && hour < 12) {
      return "Good morning"
    } else if (hour >= 12 && hour < 19) {
      return "Good afternoon"
    } else {
      return "Good evening"
    }
  }
}
