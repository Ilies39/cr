var ws = null;
var توقعاتسابقة = []; // تخزين القيم السابقة
var currentIndex = 0; // فهرس القيمة الحالية

function openWebSocket() {
    var url = 'wss://eg1xbet.com/games-frame/sockets/crash?whence=50&fcountry=8&ref=1&gr=0&appGuid=games-web-master&lng=fr&access_token=YOUR_ACCESS_TOKEN';
    ws = new WebSocket(url);
    
    ws.onopen = function() {
        console.log('WebSocket opened');
        ws.send('{"protocol":"json","version":1}\x1e');
        ws.send('{"arguments":[{"activity":30,"account":972708725}],"invocationId":"0","target":"Account","type":1}\x1e');
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
