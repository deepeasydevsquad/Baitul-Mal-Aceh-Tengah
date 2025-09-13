import { ref } from "vue"

export function useNotification() {
  const showNotification = ref(false)
  const notificationType = ref<"success" | "error">("success")
  const notificationMessage = ref("")

  function displayNotification(message: string, type: "success" | "error" = "success") {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
  }

  function hideNotification() {
    showNotification.value = false
  }

  return {
    showNotification,
    notificationType,
    notificationMessage,
    displayNotification,
    hideNotification,
  }
}
