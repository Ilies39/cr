// سكربت لجعل اللعبة تفاعلية

// وظيفة لبدء اللعبة
function startGame() {
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;

    // تحقق من وجود حساب وكلمة مرور
    if (account && password) {
        alert(`مرحبًا بك في SMASH CRASH، ${account}!`);
        // هنا يمكنك إضافة الكود لبدء اللعبة
    } else {
        alert('يرجى إدخال حساب وكلمة مرور صحيحة.');
    }
}

// إضافة حدث للزر "بدء اللعبة"
document.querySelector('button:nth-of-type(6)').addEventListener('click', startGame);