<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>توقع أرقام Crash باستخدام LSTM محسّن</title>
    <!-- تضمين مكتبة TensorFlow.js من CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            max-width: 600px;
        }
        h1 {
            text-align: center;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #218838;
        }
        p {
            text-align: center;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <h1>توقع أرقام Crash باستخدام LSTM محسّن</h1>

    <h2>ادخل الأرقام القديمة</h2>
    <textarea id="oldNumbers" rows="4" placeholder="أدخل الأرقام القديمة هنا مفصولة بفواصل..."></textarea>

    <button id="trainButton">تدريب النموذج وتوقع الأرقام القادمة</button>
    
    <p id="result"></p>

    <!-- تضمين كود JavaScript الخاص بك -->
    <script src="script.js"></script> <!-- تأكد من أن اسم الملف صحيح -->
</body>
</html>
### 2. كود JavaScript (script.js)

async function createLSTMModel() {
    const model = tf.sequential();
    model.add(tf.layers.lstm({units: 128, inputShape: [1, 1], returnSequences: true}));
    model.add(tf.layers.dropout({rate: 0.2}));
    model.add(tf.layers.lstm({units: 64}));
    model.add(tf.layers.dropout({rate: 0.2}));
    model.add(tf.layers.dense({units: 1}));
    model.compile({loss: 'meanSquaredError', optimizer: 'adam'});
    return model;
}

function normalizeData(numbers) {
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    return numbers.map(num => (num - min) / (max - min));
}

async function trainModel(model, numbers) {
    const normalizedNumbers = normalizeData(numbers);
    const xs = [];
    const ys = [];
    for (let i = 0; i < normalizedNumbers.length - 1; i++) {
        xs.push([normalizedNumbers[i]]);
        ys.push(normalizedNumbers[i + 1]);
    }

    const inputTensor = tf.tensor3d(xs, [xs.length, 1, 1]);
    const outputTensor = tf.tensor2d(ys, [ys.length, 1]);

    await model.fit(inputTensor, outputTensor, {epochs: 200, batchSize: 16});
}

document.getElementById('trainButton').addEventListener('click', async function() {
    const input = document.getElementById('oldNumbers').value;
    const numbers = input.split(',').map(Number).filter(num => !isNaN(num));
    
    if (numbers.length < 3) {
        document.getElementById('result').innerText = 'يرجى إدخال 3 أرقام على الأقل!';
        return;
    }

    const model = await createLSTMModel();
    await trainModel(model, numbers);

    const predictions = [];
    let lastInput = normalizeData([numbers[numbers.length - 1]])[0];
    for (let i = 0; i < 5; i++) {
        const inputTensor = tf.tensor3d([[lastInput]], [1, 1, 1]);
        const nextNumber = model.predict(inputTensor);
        lastInput = (await nextNumber.array())[0][0];
        predictions.push((lastInput * (Math.max(...numbers) - Math.min(...numbers)) + Math.min(...numbers)).toFixed(2));
    }

    document.getElementById('result').innerText = 'توقعات الأرقام: ' + predictions.join(', ');
});
