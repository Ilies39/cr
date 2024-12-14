
document.getElementById('trainButton').addEventListener('click', async function() {
    const inputs = document.querySelectorAll('.number-input');
    const numbers = Array.from(inputs).map(input => Number(input.value)).filter(num => !isNaN(num));
    
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
