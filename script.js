var ws = null;
var توقعاتسابقة = []; // تخزين القيم السابقة
var currentIndex = 0; // فهرس القيمة الحالية

function openWebSocket() {
    var url = 'https://eg1xbet.com/en/allgamesentrance/crash';
    ws = new WebSocket('wss://eg1xbet.com/games-frame/sockets/crash?whence=50&fcountry=8&ref=1&gr=0&appGuid=games-web-master&lng=fr&access_token=eyJhbGciOiJFUzI1NiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiI1MC8xMDY1NDc1MDI3IiwicGlkIjoiMSIsImp0aSI6IjAvYzFiMWQ4YmQzMTA0NjgzMzY1Zjc4NzMwN2MwOTFmNDM5ZDU1MzY4OWUzZmNkNWMxZWE3Yzk5MGEyZDJhMzc1OSIsImFwcCI6Ik5BIiwiaW5uZXIiOiJ0cnVlIiwibmJmIjoxNzMyNDEwNzY2LCJleHAiOjE3MzI0MjUxNjYsImlhdCI6MTczMjQxMDc2Nn0.TlFT3z2PGCsylSzQUN9QJpw7pC0DyiVMfJ4PCt6lDWnWsbi7P2eYeJB3jHeo_q3gFhg-oZnu38G3jkBgmp5X9A');
    
    ws.onopen = function() {
        console.log('WebSocket opened');
        ws.send('{"protocol":"json","version":1}\x1e');
        ws.send('{"arguments":[{"activity":30,"account":1065475027}],"invocationId":"0","target":"Account","type":1}\x1e');
    };

    ws.onclose = function() {
        console.log('WebSocket closed');
        ws = null;
    };
    
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data.slice(0, -1));
        if (data.target === 'OnCrash') {
            توقعاتسابقة.push(data.arguments[0].f);
            عرضالتوقعالتالي(); // عرض القيمة التالية
        }
    };
    
    ws.onerror = function(event) {
        console.error('WebSocket error:', event);
    };
}

function عرضالتوقعالتالي() {
    if (currentIndex < توقعاتسابقة.length) {
        var crashValueElement = document.getElementById('crash-value');
        crashValueElement.innerText = توقعاتسابقة[currentIndex];
        currentIndex++;
    }
}

// فتح الاتصال
openWebSocket();
