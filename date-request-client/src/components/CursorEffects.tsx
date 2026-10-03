'use client'

import { useEffect, useRef } from "react"

const HEARTS = ["💗", "💖", "💕", "💘", "✨"]
const TRAIL_INTERVAL = 45

const random = (min: number, max: number) => min + Math.random() * (max - min)

const spawn = (className: string, x: number, y: number, style: Record<string, string>) => {
  const el = document.createElement("span")
  el.className = className
  el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)]
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  for (const [key, value] of Object.entries(style)) el.style.setProperty(key, value)
  el.addEventListener("animationend", () => el.remove(), { once: true })
  document.body.appendChild(el)
}

export const burstHearts = (x: number, y: number, count = 14) => {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + random(-0.3, 0.3)
    const distance = random(60, 160)
    spawn("burst-heart", x, y, {
      "--dx": `${Math.cos(angle) * distance}px`,
      "--dy": `${Math.sin(angle) * distance}px`,
      "--s": `${random(0.8, 1.6)}`,
      "--r": `${random(-60, 60)}deg`,
      "font-size": `${random(14, 26)}px`,
    })
  }
}

// Spotlight that follows the cursor, a heart trail and a heart burst on click
const CursorEffects = () => {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    let lastTrail = 0
    let frame = 0

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        spotlightRef.current?.style.setProperty("--mx", `${e.clientX}px`)
        spotlightRef.current?.style.setProperty("--my", `${e.clientY}px`)
      })

      const now = performance.now()
      if (!finePointer || now - lastTrail < TRAIL_INTERVAL) return
      lastTrail = now
      spawn("trail-heart", e.clientX + random(-6, 6), e.clientY + random(-6, 6), {
        "--r": `${random(-25, 25)}deg`,
        "font-size": `${random(14, 22)}px`,
      })
    }

    const onDown = (e: PointerEvent) => burstHearts(e.clientX, e.clientY, 10)

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerdown", onDown)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [])

  return <div ref={spotlightRef} aria-hidden className="spotlight pointer-events-none fixed inset-0 z-0" />
}

export default CursorEffects
