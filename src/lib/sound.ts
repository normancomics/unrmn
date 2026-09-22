let ctx: AudioContext | null = null
let enabled = false

function audio() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function setSoundEnabled(next: boolean) {
  enabled = next
  if (next) void audio().resume()
}

export function isSoundEnabled() {
  return enabled
}

export function tap(kind: 'tick' | 'buy' | 'sell' | 'open' = 'tick') {
  if (!enabled) return
  const ac = audio()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = kind === 'sell' ? 'sawtooth' : 'square'
  osc.frequency.value = kind === 'buy' ? 620 : kind === 'sell' ? 220 : kind === 'open' ? 440 : 330
  gain.gain.value = 0.03
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12)
  osc.stop(ac.currentTime + 0.13)
}
