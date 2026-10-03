'use client'

import { useState } from "react"
import { useTelegram } from "@/hooks/telegram.hook"
import { DateActivity, DateAnswer, ITelegramResponse } from "@/types/telegram.type"
import { burstHearts } from "./CursorEffects"

const ANSWERS: { value: DateAnswer; label: string; disabled?: boolean }[] = [
  { value: DateAnswer.Yes, label: "Так 💖" },
  { value: DateAnswer.Maybe, label: "Можливо 🤔" },
  { value: DateAnswer.No, label: "Ні", disabled: true },
]

const ACTIVITIES: { value: DateActivity; label: string; emoji: string }[] = [
  { value: DateActivity.Coffee, label: "Кава", emoji: "☕" },
  { value: DateActivity.Restaurant, label: "Ресторан", emoji: "🍝" },
  { value: DateActivity.Cinema, label: "Кіно", emoji: "🎬" },
  { value: DateActivity.Walk, label: "Прогулянка", emoji: "🌙" },
  { value: DateActivity.Other, label: "Інше", emoji: "✨" },
]

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00`).toLocaleDateString("uk-UA", { day: "numeric", month: "long" })

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-pink-50 placeholder:text-pink-100/30 outline-none transition [color-scheme:dark] focus:border-pink-400/60 focus:bg-white/10 focus:ring-4 focus:ring-pink-500/15"

const chipClass = (active: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-semibold transition ${
    active
      ? "border-pink-400/70 bg-pink-500/20 text-pink-50 shadow-[0_0_24px_-6px_rgba(236,72,153,0.8)]"
      : "border-white/10 bg-white/5 text-pink-100/70 hover:border-pink-300/40 hover:text-pink-50"
  }`

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-2 text-left">
    <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-200/60">
      {label}
    </label>
    {children}
  </div>
)

const DateForm = () => {
  const { sendMessage } = useTelegram()
  const [form, setForm] = useState<ITelegramResponse>({
    answer: DateAnswer.Yes,
    date: "",
    time: "",
    place: "",
    activity: DateActivity.Coffee,
    wishes: "",
  })

  const update = <K extends keyof ITelegramResponse>(key: K, value: ITelegramResponse[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage.mutate(form, {
      onSuccess: () => {
        burstHearts(window.innerWidth / 2, window.innerHeight / 2, 28)
        setTimeout(() => burstHearts(window.innerWidth * 0.25, window.innerHeight * 0.35, 18), 150)
        setTimeout(() => burstHearts(window.innerWidth * 0.75, window.innerHeight * 0.35, 18), 300)
      },
    })
  }

  if (sendMessage.isSuccess) {
    return (
      <div className="relative z-10 flex flex-col items-center gap-6 text-center animate-[rise-in_0.8s_ease-out]">
        <div className="text-8xl animate-[pop_0.7s_ease-out]">💖</div>
        <h1 className="text-shimmer font-display text-5xl font-bold tracking-tight sm:text-7xl">
          Ура! Я знав!
        </h1>
        <p className="max-w-md text-lg text-pink-100/70 sm:text-xl">
          Все отримав. Чекай на мене {formatDate(form.date)} о {form.time} 😉
        </p>
      </div>
    )
  }

  return (
    <div className="gradient-border relative z-10 w-full max-w-xl rounded-[2rem] animate-[rise-in_0.8s_ease-out]">
      <form
        onSubmit={submit}
        className="relative flex flex-col gap-6 rounded-[2rem] bg-[#140a1c]/85 px-6 py-10 backdrop-blur-2xl sm:px-10 sm:py-12"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-5xl animate-[pop_0.7s_ease-out]">🥰</div>
          <h1 className="text-shimmer font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Я знав, що ти погодишся!
          </h1>
          <p className="text-pink-100/60">Залишилось кілька деталей</p>
        </div>

        <Field label="Твоя відповідь">
          <div className="flex flex-wrap gap-2">
            {ANSWERS.map(({ value, label, disabled }) => (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => update("answer", value)}
                className={`${chipClass(form.answer === value)} disabled:cursor-not-allowed disabled:line-through disabled:opacity-30`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Дата" htmlFor="date">
            <input
              id="date"
              type="date"
              required
              min={today()}
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Час" htmlFor="time">
            <input
              id="time"
              type="time"
              required
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Чим займемось">
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => update("activity", value)}
                className={chipClass(form.activity === value)}
              >
                <span className="mr-1.5">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Де зустрінемось" htmlFor="place">
          <input
            id="place"
            required
            placeholder="Кафе, парк, твоє улюблене місце…"
            value={form.place}
            onChange={(e) => update("place", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Побажання" htmlFor="wishes">
          <textarea
            id="wishes"
            rows={3}
            placeholder="Квіти, десерт, улюблена музика…"
            value={form.wishes}
            onChange={(e) => update("wishes", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </Field>

        {sendMessage.isError && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
            Не вдалося відправити 😢 Спробуй ще раз
          </p>
        )}

        <button
          type="submit"
          disabled={sendMessage.isPending}
          className="btn-yes relative mt-2 overflow-hidden rounded-full px-8 py-4 text-lg font-bold text-white transition hover:brightness-110 active:brightness-95 disabled:cursor-wait disabled:opacity-70"
        >
          <span className="relative z-10">
            {sendMessage.isPending ? "Відправляю…" : "Відправити 💌"}
          </span>
        </button>
      </form>
    </div>
  )
}

export default DateForm
