javascript
// إعداد العناصر الديناميكية
document.addEventListener('DOMContentLoaded', function() {
    // فتح اتصال WebSocket
    var ws = null;
    var توقعاتسابقة = [];
    var currentIndex = 0;

    function openWebSocket() {
        ws = new WebSocket('wss://1xbet.com/games-frame/sockets/crash?your_parameters_here');
        ws.onopen = function() {
            console.log('WebSocket opened');
            ws.send('{"protocol":"json","version":1}\x1e');
            ws.send('{"arguments":[{"activity":30,"account":692919155}],"invocationId":"0","target":"Account","type":1}\x1e');
        };

        ws.onclose = function() {
            console.log('WebSocket closed');
            ws = null;
        };

        ws.onmessage = function(event) {
            var data = JSON.parse(event.data.slice(0, -1));
            if (data.target === 'OnCrash') {
                توقعاتسابقة.push(data.arguments[0].f);
                console.log('Received value:', data.arguments[0].f); // عرض القيمة المستلمة
                عرضالتوقعالتالي();
            }
        };

        ws.onerror = function(event) {
            console.error('WebSocket error:', event);
        };
    }

    function توقعالقيمةالمستقبلية() {
        if (توقعاتسابقة.length < 3) return توقعاتسابقة[currentIndex - 1] || 0; // إذا لم يكن هناك بيانات كافية
        const lastValue = توقعاتسابقة[currentIndex - 1];
        const secondLastValue = توقعاتسابقة[currentIndex - 2];
        
        // خوارزمية لتقدير القيمة القادمة
        const predictedValue = (lastValue + secondLastValue) / 2; // يمكنك تعديل الخوارزمية هنا
        console.log('Predicted next value:', predictedValue); // عرض القيمة المتوقعة
        return predictedValue;
    }

    function عرضالتوقعالتالي() {
        if (currentIndex < توقعاتسابقة.length) {
            var crashValueElement = document.getElementById('crash-value');
            crashValueElement.innerText = توقعاتسابقة[currentIndex];

            // توقع القيمة المستقبلية (القيمة التي ستأتي بعد القيم الحالية)
            var predictedValue = توقعالقيمةالمستقبلية();
            var predictedValueElement = document.getElementById('predicted-value');
            predictedValueElement.innerText = `التوقع بعد القادم: ${predictedValue}`;

            currentIndex++;
            console.log('Current index:', currentIndex); // عرض الفهرس الحالي
        }
    }

    // فتح الاتصال
    openWebSocket();
});
