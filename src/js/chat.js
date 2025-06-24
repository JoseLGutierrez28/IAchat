document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".chat-input-area");
  const input = form.querySelector("input");
  const chat = document.getElementById("chat");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;

    // Mostrar mensaje del usuario
    chat.innerHTML += `<div class="message sent">${userText}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      chat.innerHTML += `<div class="message received">${data.reply}</div>`;
      chat.scrollTop = chat.scrollHeight;
    } catch (err) {
      chat.innerHTML += `<div class="message received">Ocurrió un error.</div>`;
    }
  });
});
