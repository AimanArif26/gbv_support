// Lab 3: Contact form (HTML form + validation + popup dialog)
//
// Flow:
//   1. The user fills in the HTML form and clicks "Send message".
//   2. submit() stops the normal submit and checks every field.
//   3. If something is wrong, the errors are shown with innerHTML.
//   4. If everything is fine, a popup dialog shows a summary to confirm.
//   5. confirm() shows a window.alert(), waits a moment with setTimeout()
//      and then really sends the form to the Rails send_message action.
//
// It uses all 4 output methods: innerHTML, window.alert(), console and,
// in hotline_controller.js, document.write().
import { Controller } from "@hotwired/stimulus"

const MIN_MESSAGE = 10
const MAX_MESSAGE = 500
// Simple email pattern: something@something.something
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default class extends Controller {
  static targets = ["form", "name", "email", "topic", "message", "acknowledge",
                    "counter", "errors", "dialog", "summary", "confirmButton", "sendButton"]

  connect() {
    this.confirmed = false   // becomes true only after the user confirms in the popup
    this.count()
    console.info("[Contact] Contact form ready.")
  }

  // ---------- Live character counter (input event) ----------
  count() {
    const length = this.messageTarget.value.trim().length
    const left = MAX_MESSAGE - length

    // Ternary operators pick the colour and the wording
    const colour = left < 0 ? "text-danger" : left <= 50 ? "text-warning" : "text-muted"
    const note = left < 0 ? `${Math.abs(left)} too many` : `${left} left`

    // Output method 1: innerHTML
    this.counterTarget.innerHTML =
      `<span class="${colour}">${length} / ${MAX_MESSAGE} characters (${note})</span>`
  }

  // ---------- Step 2: check the form when it is submitted ----------
  submit(event) {
    // After the user confirms, let Turbo send the form to Rails normally
    if (this.confirmed) return

    event.preventDefault()
    const data = this.readForm()
    const errors = this.validate(data)

    if (errors.length > 0) {
      this.showErrors(errors)
      // Output method 4: console
      console.warn(`[Contact] Form has ${errors.length} error(s):`, errors.map((e) => e.text))
      return
    }

    this.clearErrors()
    this.openDialog(data)
  }

  // Collects the values from the form into one object
  readForm() {
    return {
      name: this.nameTarget.value.trim(),
      email: this.emailTarget.value.trim(),
      topic: this.topicTarget.value,
      message: this.messageTarget.value.trim(),
      acknowledged: this.acknowledgeTarget.checked
    }
  }

  // Returns a list of errors. An empty list means the form is valid.
  validate(data) {
    const errors = []

    if (data.name.length < 2) {
      errors.push({ field: this.nameTarget, text: "Please enter your name (at least 2 letters)." })
    }

    if (data.email === "") {
      errors.push({ field: this.emailTarget, text: "Please enter your email address." })
    } else if (!EMAIL_PATTERN.test(data.email)) {
      errors.push({ field: this.emailTarget, text: "Please enter a valid email, for example aiman@gmail.com." })
    }

    if (!data.topic) {
      errors.push({ field: this.topicTarget, text: "Please choose a topic." })
    }

    if (data.message.length < MIN_MESSAGE || data.message.length > MAX_MESSAGE) {
      errors.push({ field: this.messageTarget,
                    text: `Your message must be between ${MIN_MESSAGE} and ${MAX_MESSAGE} characters.` })
    }

    if (!data.acknowledged) {
      errors.push({ field: this.acknowledgeTarget, text: "Please tick the box to confirm this is not an emergency." })
    }

    return errors
  }

  showErrors(errors) {
    // Mark only the wrong fields in red (Bootstrap's is-invalid class)
    const wrongFields = errors.map((error) => error.field)
    this.allFields.forEach((field) => field.classList.toggle("is-invalid", wrongFields.includes(field)))

    // for...of loop builds the list of errors
    let items = ""
    for (const error of errors) {
      items += `<li>${error.text}</li>`
    }

    // Output method 1: innerHTML
    this.errorsTarget.innerHTML = `
      <div class="alert alert-warning">
        <strong>Please fix ${errors.length} problem${errors.length === 1 ? "" : "s"}:</strong>
        <ul class="mb-0 mt-2">${items}</ul>
      </div>`

    errors[0].field.focus()
  }

  clearErrors() {
    this.allFields.forEach((field) => field.classList.remove("is-invalid"))
    this.errorsTarget.innerHTML = ""
  }

  get allFields() {
    return [this.nameTarget, this.emailTarget, this.topicTarget, this.messageTarget, this.acknowledgeTarget]
  }

  // ---------- Step 4: popup dialog ----------
  openDialog(data) {
    const safe = (text) => this.escapeHtml(text)   // stops HTML/script being injected

    // Output method 1: innerHTML (fills the popup with the user's answers)
    this.summaryTarget.innerHTML = `
      <dl class="row small mb-0">
        <dt class="col-4">Name</dt>    <dd class="col-8">${safe(data.name)}</dd>
        <dt class="col-4">Email</dt>   <dd class="col-8">${safe(data.email)}</dd>
        <dt class="col-4">Topic</dt>   <dd class="col-8">${safe(data.topic)}</dd>
        <dt class="col-4">Message</dt> <dd class="col-8 text-break">${safe(data.message)}</dd>
      </dl>`

    this.pending = data
    this.dialogTarget.showModal()   // native HTML <dialog> popup
  }

  closeDialog() {
    this.dialogTarget.close()
  }

  // ---------- Step 5: user confirmed in the popup ----------
  confirm() {
    const data = this.pending

    // Output method 4: console (a table is easy to read in DevTools)
    console.table({ name: data.name, email: data.email, topic: data.topic,
                    characters: data.message.length })

    this.showEventLoopOrder()

    // Output method 3: window.alert()
    window.alert(`Thank you, ${data.name}! Your message about "${data.topic}" will now be sent.`)

    this.confirmButtonTarget.disabled = true
    this.confirmButtonTarget.innerHTML =
      `<span class="spinner-border spinner-border-sm me-1"></span> Sending...`

    // Event loop: wait 800 ms (without freezing the page), then send the form
    setTimeout(() => {
      this.dialogTarget.close()
      this.confirmed = true
      this.formTarget.requestSubmit()   // goes to PagesController#send_message
      console.log("[Contact] Form sent to the server at", new Date().toLocaleTimeString("en-MY"))
    }, 800)
  }

  // Shows in the console that the event loop runs code in this order:
  // normal (synchronous) code -> Promise (microtask) -> setTimeout (task)
  showEventLoopOrder() {
    console.group("[Contact] Event loop order")
    console.log("1. Synchronous code runs first")
    setTimeout(() => {
      console.log("3. setTimeout callback runs last (task queue)")
      console.groupEnd()
    }, 0)
    Promise.resolve().then(() => console.log("2. Promise callback runs next (microtask queue)"))
  }

  // Turns characters like < and > into safe text
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}
