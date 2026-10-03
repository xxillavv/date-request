# 💌 Date Request

Інтерактивне запрошення на побачення: людина відкриває сторінку, бачить питання **«Підеш зі мною на побачення?»**, а кнопка **«Ні»** втікає від курсора. Після згоди заповнюється коротка форма з деталями, і відповідь одразу приходить вам у **Telegram**.

```
┌──────────────┐   POST /telegram/sendMessage   ┌──────────────┐   Bot API   ┌──────────┐
│  Next.js UI  │ ─────────────────────────────▶ │  NestJS API  │ ──────────▶ │ Telegram │
│  (клієнт)    │                                │  (сервер)    │             │   чат    │
└──────────────┘                                └──────────────┘             └──────────┘
```

## ✨ Можливості

- **Кнопка «Ні», що тікає** — ухиляється від курсора й дотику, щоразу змінюючи підпис («Точно ні?», «Подумай ще 🥺»…), а кнопка «Так» з кожною спробою росте.
- **Анімований фон** — aurora-градієнти, зерно, спливаючі сердечка, ефекти курсора, 3D-нахил картки та «магнітна» кнопка «Так».
- **Форма деталей** — відповідь (так / можливо), дата, час, місце, активність (кава, ресторан, кіно, прогулянка, інше) та побажання.
- **Сповіщення в Telegram** — сервер валідує дані та надсилає відформатоване повідомлення у вказаний чат.

## 🧱 Стек

| Частина | Технології |
| --- | --- |
| [`date-request-client`](./date-request-client) | Next.js 16, React 19, Tailwind CSS 4, TanStack Query, React Compiler |
| [`date-request-server`](./date-request-server) | NestJS 12, class-validator, @nestjs/config, axios, Vitest, oxlint |

## 📁 Структура

```
date-request/
├── date-request-client/        # Фронтенд (Next.js)
│   └── src/
│       ├── app/                # Сторінка, layout, глобальні стилі
│       ├── components/         # DateQuestion, DateForm, CursorEffects, Provider
│       ├── hooks/              # useTelegram — мутація відправки відповіді
│       └── types/              # Типи запиту
└── date-request-server/        # Бекенд (NestJS)
    └── src/
        ├── dto/                # CreateTelegramMessageDto + валідація
        └── telegram/           # Контролер і сервіс відправки в Telegram
```

## 🚀 Швидкий старт

### Передумови

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- Telegram-бот: створіть його через [@BotFather](https://t.me/BotFather) і отримайте токен
- ID чату, куди надходитимуть відповіді (наприклад, через [@userinfobot](https://t.me/userinfobot)); не забудьте спершу написати своєму боту `/start`

### 1. Сервер

```bash
cd date-request-server
cp .env.example .env   # заповніть змінні
pnpm install
pnpm start:dev         # http://localhost:3001
```

### 2. Клієнт

```bash
cd date-request-client
cp .env.example .env.local
pnpm install
pnpm dev               # http://localhost:3000
```

## ⚙️ Змінні середовища

**`date-request-server/.env`**

| Змінна | Опис |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Токен бота від @BotFather |
| `TELEGRAM_BOT_ID` | ID чату, який отримує сповіщення |
| `PORT` | Порт сервера (за замовчуванням `3001`) |

**`date-request-client/.env.local`**

| Змінна | Опис |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL сервера, напр. `http://localhost:3001` |

## 📡 API

### `POST /telegram/sendMessage`

```json
{
  "answer": "yes",
  "date": "2026-10-14",
  "time": "19:30",
  "place": "Кав'ярня на розі",
  "activity": "coffee",
  "wishes": "Тірамісу 🍰"
}
```

| Поле | Тип | Обовʼязкове | Примітка |
| --- | --- | --- | --- |
| `answer` | `yes` \| `maybe` \| `no` | так | |
| `date` | `YYYY-MM-DD` | якщо `answer = yes` | |
| `time` | `HH:mm` | якщо `answer = yes` | |
| `place` | string | якщо `answer = yes` | до 200 символів |
| `activity` | `coffee` \| `restaurant` \| `cinema` \| `walk` \| `other` | ні | |
| `wishes` | string | ні | до 500 символів |

Відповідь: `{ "status": "ok", "data": { ... } }`. Некоректне тіло запиту повертає `400`, помилка Telegram — `500`.

## 🛠 Скрипти

| Клієнт | Сервер |
| --- | --- |
| `pnpm dev` — dev-сервер | `pnpm start:dev` — запуск з watch |
| `pnpm build` — production-збірка | `pnpm build` — збірка в `dist/` |
| `pnpm start` — запуск збірки | `pnpm start:prod` — запуск збірки |
| `pnpm lint` — ESLint | `pnpm lint` — oxlint |
| | `pnpm test` / `pnpm test:e2e` — тести (Vitest) |

---

Зроблено з 💖 для однієї важливої відповіді.
