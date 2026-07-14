export function todayIso(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

export function nowIso(now = new Date()) {
  return now.toISOString()
}
