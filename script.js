const API_KEY = "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";

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            chatBox.innerHTML += `<div class="message bot">${reply}</div>`;
        } else {
            chatBox.innerHTML += `<div class="message bot">No response.</div>`;
        }

    } catch (error) {
        chatBox.innerHTML += `<div class="message bot">Error connecting to AI.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}
