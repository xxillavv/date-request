'use client'

import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { burstHearts } from "./CursorEffects"
import DateForm from "./DateForm"

const NO_LABELS = [
  "Ні",
  "Точно ні?",
  "Подумай ще 🥺",
  "Не поспішай",
  "Ну будь ласка",
  "Я ж старався",
  "Остання відповідь?",
  "Неможливо 😌",
]

const MIN_DISTANCE = 150
const PADDING = 16
const MAX_TILT = 8
const MAGNET_STRENGTH = 0.35

const DateQuestion = () => {
  const noRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const magnetRef = useRef<HTMLDivElement>(null)
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null)
  const [dodges, setDodges] = useState(0)
  const [accepted, setAccepted] = useState(false)

  // Position is stored as fractions of the free space (0..1) and offset with
  // translate(-f%), so the button stays on screen whatever its label width is.
  const dodge = (pointerX?: number, pointerY?: number) => {
    const button = noRef.current
    if (!button) return

    const { width, height } = button.getBoundingClientRect()
    const freeX = window.innerWidth - 2 * PADDING
    const freeY = window.innerHeight - 2 * PADDING

    let x = 0
    let y = 0
    for (let i = 0; i < 20; i++) {
      x = Math.random()
      y = Math.random()

      if (pointerX === undefined || pointerY === undefined) break
      const centerX = PADDING + x * (freeX - width) + width / 2
      const centerY = PADDING + y * (freeY - height) + height / 2
      if (Math.hypot(centerX - pointerX, centerY - pointerY) > MIN_DISTANCE) break
    }

    setNoPosition({ x, y })
    setDodges((d) => d + 1)
  }

  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card || e.pointerType !== "mouse") return

    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    card.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * MAX_TILT}deg) rotateY(${(px - 0.5) * MAX_TILT}deg)`
    card.style.setProperty("--gx", `${px * 100}%`)
    card.style.setProperty("--gy", `${py * 100}%`)
  }

  const resetTilt = () => {
    if (cardRef.current) cardRef.current.style.transform = ""
  }

  const magnet = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = magnetRef.current
    if (!el || e.pointerType !== "mouse") return

    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${dx * MAGNET_STRENGTH}px, ${dy * MAGNET_STRENGTH}px)`
  }

  const resetMagnet = () => {
    if (magnetRef.current) magnetRef.current.style.transform = ""
  }

  const accept = (e: React.MouseEvent<HTMLButtonElement>) => {
    burstHearts(e.clientX, e.clientY, 24)
    setTimeout(() => burstHearts(window.innerWidth * 0.25, window.innerHeight * 0.4, 18), 150)
    setTimeout(() => burstHearts(window.innerWidth * 0.75, window.innerHeight * 0.4, 18), 300)
    setAccepted(true)
  }

  if (accepted) return <DateForm />

  const yesScale = Math.min(1 + dodges * 0.08, 1.8)

  const noButton = (
    <button
      ref={noRef}
      type="button"
      onPointerEnter={(e) => dodge(e.clientX, e.clientY)}
      onPointerDown={(e) => {
        e.preventDefault()
        dodge(e.clientX, e.clientY)
      }}
      onClick={(e) => {
        e.preventDefault()
        dodge()
      }}
      style={
        noPosition
          ? {
              position: "fixed",
              left: `calc(${PADDING}px + ${noPosition.x} * (100vw - ${2 * PADDING}px))`,
              top: `calc(${PADDING}px + ${noPosition.y} * (100dvh - ${2 * PADDING}px))`,
              transform: `translate(${-noPosition.x * 100}%, ${-noPosition.y * 100}%)`,
              zIndex: 50,
            }
          : undefined
      }
      className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-semibold text-pink-100/80 shadow-lg shadow-black/20 backdrop-blur-xl transition-[left,top,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    >
      {NO_LABELS[dodges % NO_LABELS.length]}
    </button>
  )

  return (
    <div
      ref={cardRef}
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      className="gradient-border relative z-10 w-full max-w-xl rounded-4xl transition-transform duration-200 ease-out animate-[rise-in_0.9s_ease-out] will-change-transform"
    >
      <div className="relative flex flex-col items-center gap-9 overflow-hidden rounded-4xl bg-[#140a1c]/80 px-6 py-12 text-center backdrop-blur-2xl sm:px-14 sm:py-16">
        <div aria-hidden className="card-glare pointer-events-none absolute inset-0" />

        <span className="relative rounded-full border border-pink-300/20 bg-pink-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-pink-200/80">
          Маленьке питання
        </span>

        <div className="relative">
          <div aria-hidden className="absolute inset-0 rounded-full bg-pink-500/40 blur-2xl" />
          <div className="relative text-7xl animate-[heartbeat_1.4s_ease-in-out_infinite]">💌</div>
        </div>

        <h1 className="text-shimmer relative font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
          Підеш зі мною на&nbsp;побачення?
        </h1>

        <div className="relative flex flex-wrap items-center justify-center gap-5">
          <div
            ref={magnetRef}
            onPointerMove={magnet}
            onPointerLeave={resetMagnet}
            className="p-3 transition-transform duration-200 ease-out"
          >
            <button
              type="button"
              onClick={accept}
              style={{ transform: `scale(${yesScale})` }}
              className="btn-yes relative overflow-hidden rounded-full px-12 py-3.5 text-lg font-bold text-white transition-[transform,filter] duration-300 hover:brightness-110 active:brightness-95"
            >
              <span className="relative z-10 inline-flex items-center gap-2">Так <span>💕</span></span>
            </button>
          </div>

          {noPosition ? createPortal(noButton, document.body) : noButton}
        </div>
      </div>
    </div>
  )
}

export default DateQuestion
