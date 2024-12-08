<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script>
    async function createModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));
        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
        return model;
    }

    async function trainModel(model, xs, ys) {
        await model.fit(xs, ys, {epochs: 100});
    }

    async function predictValue(model, input) {
        const output = model.predict(tf.tensor2d([input], [1, 1]));
        output.print(); // عرض النتيجة في وحدة التحكم
    }

    document.addEventListener('DOMContentLoaded', async function() {
        const model = await createModel();

        // بيانات تدريب عشوائية
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

        await trainModel(model, xs, ys);

        // إجراء تنبؤ
        predictValue(model, 5); // تنبؤ القيمة عند 5
    });
</script>
```
