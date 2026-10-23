// Lab 3: Date and time helpers shared by several Stimulus controllers.
// All times are shown in Malaysia time (Asia/Kuala_Lumpur), even if the
// visitor's computer is set to another time zone.

export const MALAYSIA_TIME_ZONE = "Asia/Kuala_Lumpur"

// Returns the current hour in Malaysia as a decimal number.
// Example: 2:30 pm  ->  14.5
export function malaysiaHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MALAYSIA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date)

  const hour = Number(parts.find((part) => part.type === "hour").value)
  const minute = Number(parts.find((part) => part.type === "minute").value)

  return hour + minute / 60 // arithmetic operators: + and /
}

// "Friday, 23 October 2026, 2:35:10 pm"
export function formatLongDateTime(date = new Date()) {
  return date.toLocaleString("en-MY", {
    timeZone: MALAYSIA_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  })
}

// "2:35 pm"
export function formatShortTime(date = new Date()) {
  return date.toLocaleTimeString("en-MY", {
    timeZone: MALAYSIA_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}

// Turns an hour number into a label. Example: 8 -> "8:00 am", 24 -> "midnight"
export function hourLabel(hour) {
  if (hour === 0 || hour === 24) return "midnight"
  if (hour === 12) return "12:00 pm"

  const suffix = hour < 12 ? "am" : "pm"        // ternary operator
  const twelveHour = hour > 12 ? hour - 12 : hour
  return `${twelveHour}:00 ${suffix}`
}
