// Lab 3: Live clock (date and time handling + event loop)
//
// Used in the footer of every page and in the Home page hero box.
//   <footer data-controller="clock">
//     <span data-clock-target="time"></span>
//   </footer>
//
// setInterval() puts a callback in the browser's task queue every 1000 ms.
// The event loop runs it when the page is not busy, so the clock keeps
// ticking without freezing the page.
import { Controller } from "@hotwired/stimulus"
import { malaysiaHour, formatLongDateTime, formatShortTime } from "lib/time_helpers"

export default class extends Controller {
  static targets = ["time", "greeting"]
  static values = { format: { type: String, default: "long" } }

  // Runs when the element appears on the page
  connect() {
    this.tick()                                           // show the time straight away
    this.timer = setInterval(() => this.tick(), 1000)     // then update every second
  }

  // Runs when the element leaves the page (e.g. Turbo moves to another page).
  // Stopping the timer prevents memory leaks.
  disconnect() {
    clearInterval(this.timer)
  }

  tick() {
    const now = new Date()

    if (this.hasTimeTarget) {
      // Output method 1: innerHTML
      this.timeTarget.innerHTML = this.formatValue === "short"
        ? `<strong>${formatShortTime(now)}</strong>`
        : `Malaysia time: <strong>${formatLongDateTime(now)}</strong>`
    }

    if (this.hasGreetingTarget) {
      this.greetingTarget.innerHTML = this.greetingFor(malaysiaHour(now))
    }
  }

  // Control statement (if / else if / else) with comparison operators
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
