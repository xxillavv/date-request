import CursorEffects from "@/components/CursorEffects";
import DateQuestion from "@/components/DateQuestion";

const HEARTS = ["💗", "💖", "💕", "💘", "💞"];

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora-blob -left-[10%] -top-[15%] h-[55vmax] w-[55vmax] bg-pink-600 animate-[drift-1_22s_ease-in-out_infinite]" />
        <div className="aurora-blob -right-[15%] top-[10%] h-[50vmax] w-[50vmax] bg-violet-700 animate-[drift-2_26s_ease-in-out_infinite]" />
        <div className="aurora-blob -bottom-[25%] left-[20%] h-[45vmax] w-[45vmax] bg-rose-500 animate-[drift-3_18s_ease-in-out_infinite]" />
        <div className="aurora-blob bottom-[5%] -right-[5%] h-[30vmax] w-[30vmax] bg-fuchsia-500/70 animate-[drift-1_30s_ease-in-out_infinite_reverse]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#0b0610_85%)]" />
        <div className="grain absolute inset-0" />

        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="absolute bottom-[-10%] text-xl animate-[float_linear_infinite]"
            style={{
              left: `${(i * 8.7 + 3) % 100}%`,
              animationDuration: `${12 + (i % 5) * 3}s`,
              animationDelay: `${(i * 1.7) % 12}s`,
            }}
          >
            {HEARTS[i % HEARTS.length]}
          </span>
        ))}
      </div>

      <CursorEffects />
      <DateQuestion />
    </main>
  );
}
