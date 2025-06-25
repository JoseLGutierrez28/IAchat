document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".chat-input-area");
  const input = form.querySelector("input");
  const chat = document.getElementById("chat");

  // Función para escribir letra por letra
  function escribirMensajeLento(container, texto, velocidad = 20) {
    let i = 0;
    const escribir = () => {
      if (i < texto.length) {
        container.innerHTML += texto.charAt(i);
        i++;
        setTimeout(escribir, velocidad);
      }
    };
    escribir();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;

    // Mostrar mensaje del usuario
    chat.innerHTML += `<div class="message sent">${userText}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;


    // --------------------  loader -------------------------
    const loader = document.createElement("div");
    loader.className = "message received loader";
    loader.innerText = "Escribiendo";
    chat.appendChild(loader);

    let puntos = 0;
    const interval = setInterval(() => {
      puntos = (puntos + 1) % 4;
      loader.innerText = "Escribiendo" + ".".repeat(puntos);
    }, 400);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      clearInterval(interval); // Detener animación de loader
      loader.remove(); // Eliminar loader

      // --------------------  loader -------------------------

      
      // Crear un div vacío y escribir la respuesta con efecto
      const replyDiv = document.createElement("div");
      replyDiv.className = "message received";
      chat.appendChild(replyDiv);
      escribirMensajeLento(replyDiv, data.reply);
      chat.scrollTop = chat.scrollHeight;
    } catch (err) {
      clearInterval(interval);
      loader.remove();
      chat.innerHTML += `<div class="message received">Ocurrió un error por favor intentelo nuevamente.</div>`;
    }
  });
});
