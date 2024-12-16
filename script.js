const crashValues = [];
let currentIndex = 0;
const crashValueElement = document.getElementById("crashValue");

// اتصال WebSocket
const webSocketUrl = "wss://1xbet.com/games-frame/sockets/crash?whence=50&fcountry=8&ref=1&gr=70&appGuid=games-web-master&lng=ar&access_token=eyJhbGciOiJFUzI1NiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiI1MC82OTI5MTkxNTUiLCJwaWQiOiIxIiwianRpIjoiMC9lZTQ4NDAyMDQ2MWE4MzJjYjIwNDE4YmY4MzYwYWRmYmUxNWE5ZGMzOGMxNjU5MzVjZWIxNGMxOTQxNmU0ZDRjIiwiYXBwIjoiTkEiLCJpbm5lciI6InRydWUiLCJuYmYiOjE3MzQzODY4NDAsImV4cCI6MTczNDQwMTI0MCwiaWF0IjoxNzM0Mzg2ODQwfQ.4dAT_0JJwQkBgBOu7P69sRL6LkDJ_2RKeRh1tqYUm-q1PJXs0s4Rj8TvXN4GF6WKa2JHdZKfUZnZKUjEokffzw";
const socket = new WebSocket(webSocketUrl);

socket.onopen = () => {
    console.log("WebSocket opened");
    socket.send(JSON.stringify({ "protocol": "json", "version": 1 }));
    socket.send(JSON.stringify({
        "arguments": [{ "activity": 30, "account": 692919155 }],
        "invocationId": "0",
        "target": "Account",
        "type": 1
    }));
};

socket.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data);
        if (message.target === "OnCrash") {
            const crashValue = message.arguments[0].f;
            crashValues.push(crashValue);
        }
    } catch (error) {
        console.error("Error parsing message:", error);
    }
};

socket.onclose = (event) => {
    console.log("WebSocket closed:", event.reason);
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

// تحديث القيمة المعروضة كل ثانية
setInterval(() => {
    if (currentIndex < crashValues.length) {
        const value = crashValues[currentIndex];
        crashValueElement.textContent = value.toFixed(2);
        currentIndex++;
    }
}, 1000);
