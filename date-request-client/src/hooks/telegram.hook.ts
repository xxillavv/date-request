import { ITelegramResponse } from "@/types/telegram.type"
import { useMutation } from "@tanstack/react-query"

const sendResponseMessage = async (body: ITelegramResponse) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/telegram/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status} ${res.statusText}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const useTelegram = () => {
  const sendMessageMutation = useMutation({
    mutationKey: ['send-message'],
    mutationFn: sendResponseMessage,
  })

  return {
    sendMessage: sendMessageMutation
  }
}
