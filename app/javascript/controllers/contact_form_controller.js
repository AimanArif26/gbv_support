import { Controller } from "@hotwired/stimulus"

const MIN_MESSAGE = 10
const MAX_MESSAGE = 500
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default class extends Controller {
  static targets = ["form", "name", "email", "topic", "message", "acknowledge",
                    "counter", "errors", "dialog", "summary", "confirmButton", "sendButton"]

  connect() {
    this.confirmed = false
    this.count()
    console.info("[Contact] Contact form ready.")
  }

  count() {
    const length = this.messageTarget.value.trim().length
    const left = MAX_MESSAGE - length

    const colour = left < 0 ? "text-danger" : left <= 50 ? "text-warning" : "text-muted"
    const note = left < 0 ? `${Math.abs(left)} too many` : `${left} left`

    this.counterTarget.innerHTML =
      `<span class="${colour}">${length} / ${MAX_MESSAGE} characters (${note})</span>`
  }

  submit(event) {
    if (this.confirmed) return

    event.preventDefault()
    const data = this.readForm()
    const errors = this.validate(data)

    if (errors.length > 0) {
      this.showErrors(errors)
      console.warn(`[Contact] Form has ${errors.length} error(s):`, errors.map((e) => e.text))
      return
    }

    this.clearErrors()
    this.openDialog(data)
  }

  readForm() {
    return {
      name: this.nameTarget.value.trim(),
      email: this.emailTarget.value.trim(),
      topic: this.topicTarget.value,
      message: this.messageTarget.value.trim(),
      acknowledged: this.acknowledgeTarget.checked
    }
  }

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
    const wrongFields = errors.map((error) => error.field)
    this.allFields.forEach((field) => field.classList.toggle("is-invalid", wrongFields.includes(field)))

    let items = ""
    for (const error of errors) {
      items += `<li>${error.text}</li>`
    }

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

  openDialog(data) {
    const safe = (text) => this.escapeHtml(text)

    this.summaryTarget.innerHTML = `
      <dl class="row small mb-0">
        <dt class="col-4">Name</dt>    <dd class="col-8">${safe(data.name)}</dd>
        <dt class="col-4">Email</dt>   <dd class="col-8">${safe(data.email)}</dd>
        <dt class="col-4">Topic</dt>   <dd class="col-8">${safe(data.topic)}</dd>
        <dt class="col-4">Message</dt> <dd class="col-8 text-break">${safe(data.message)}</dd>
      </dl>`

    this.pending = data
    this.dialogTarget.showModal()
  }

  closeDialog() {
    this.dialogTarget.close()
  }

  confirm() {
    const data = this.pending

    console.table({ name: data.name, email: data.email, topic: data.topic,
                    characters: data.message.length })

    this.showEventLoopOrder()

    window.alert(`Thank you, ${data.name}! Your message about "${data.topic}" will now be sent.`)

    this.confirmButtonTarget.disabled = true
    this.confirmButtonTarget.innerHTML =
      `<span class="spinner-border spinner-border-sm me-1"></span> Sending...`

    setTimeout(() => {
      this.dialogTarget.close()
      this.confirmed = true
      this.formTarget.requestSubmit()
      console.log("[Contact] Form sent to the server at", new Date().toLocaleTimeString("en-MY"))
    }, 800)
  }

  showEventLoopOrder() {
    console.group("[Contact] Event loop order")
    console.log("1. Synchronous code runs first")
    setTimeout(() => {
      console.log("3. setTimeout callback runs last (task queue)")
      console.groupEnd()
    }, 0)
    Promise.resolve().then(() => console.log("2. Promise callback runs next (microtask queue)"))
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}
