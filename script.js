const images = {
    OHTANISAN: ['ohtani1.jpg', 'ohtani2.jpg', 'ohtani3.jpg', 'ohtani4.jpg', 'ohtani5.jpg'],
    MIZUHARASAN: ['mizuhara1.jpg', 'mizuhara2.jpg', 'mizuhara3.jpg', 'mizuhara4.jpg', 'mizuhara5.jpg'],
    ELONSAN: ['elon1.jpg', 'elon2.jpg', 'elon3.jpg', 'elon4.jpg', 'elon5.jpg'],
    TRUMPSAN: ['trump1.jpg', 'trump2.jpg', 'trump3.jpg', 'trump4.jpg', 'trump5.jpg']
};
const answers = ['OHTANISAN', 'MIZUHARASAN', 'ELONSAN', 'TRUMPSAN'];

let currentQuestion = 0;
let score = 0;
let timer;
let selectedAnswer = null;
const bgm = document.getElementById('bgm');

function setStartImage() {
    const ohtaniImages = images.OHTANISAN;
    const randomIndex = Math.floor(Math.random() * ohtaniImages.length);
    const startImage = document.getElementById('start-image');
    startImage.src = ohtaniImages[randomIndex] + '?t=' + Date.now();
    startImage.onload = () => {
        // 画像読み込み完了
    };
    startImage.onerror = () => {
        console.error('スタート画面の画像の読み込みに失敗しました: ' + startImage.src);
        startImage.src = 'default.jpg'; // デフォルト画像を用意してください
    };
}

function generateQuestion() {
    const randomAnswerIndex = Math.floor(Math.random() * answers.length);
    const correctAnswer = answers[randomAnswerIndex];
    const imageList = images[correctAnswer];
    const randomImageIndex = Math.floor(Math.random() * imageList.length);
    const imageSrc = imageList[randomImageIndex] + '?t=' + Date.now();
    let wrongAnswer;
    do {
        wrongAnswer = answers[Math.floor(Math.random() * answers.length)];
    } while (wrongAnswer === correctAnswer);
    const options = [correctAnswer, wrongAnswer].sort(() => Math.random() - 0.5);
    return { imageSrc, correctAnswer, options };
}

function showQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';

    const question = generateQuestion();
    const quizImage = document.getElementById('quiz-image');
    quizImage.src = question.imageSrc;

    // 画像の読み込みが成功しても失敗しても、選択肢とタイマーを開始
    quizImage.onload = () => {
        displayOptionsAndStartTimer(question);
    };
    quizImage.onerror = () => {
        console.error('出題中の画像の読み込みに失敗しました: ' + question.imageSrc);
        quizImage.src = 'default.jpg'; // デフォルト画像を用意してください
        displayOptionsAndStartTimer(question);
    };
}

function displayOptionsAndStartTimer(question) {
    document.getElementById('option1').textContent = question.options[0];
    document.getElementById('option2').textContent = question.options[1];
    selectedAnswer = null;
    startTimer(question.correctAnswer);
}

function startTimer(correctAnswer) {
    let timeLeft = 2;
    document.getElementById('timer').textContent = `Time left: ${timeLeft} seconds`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time left: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (selectedAnswer === null) {
                selectedAnswer = 'timeout';
                checkAnswer(correctAnswer);
            }
        }
    }, 1000);
}

function checkAnswer(correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < 10) {
        showQuiz();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('score').textContent = `Your score: ${score} / 10`;

    const allImages = [...images.OHTANISAN, ...images.MIZUHARASAN, ...images.ELONSAN, ...images.TRUMPSAN];
    const randomImageIndex = Math.floor(Math.random() * allImages.length);
    const resultImage = document.getElementById('result-image');
    resultImage.src = allImages[randomImageIndex] + '?t=' + Date.now();
    resultImage.onload = () => {
        // 画像読み込み完了
    };
    resultImage.onerror = () => {
        console.error('結果画面の画像の読み込みに失敗しました: ' + resultImage.src);
        resultImage.src = 'default.jpg'; // デフォルト画像を用意してください
    };
}

document.getElementById('start-button').addEventListener('click', () => {
    setStartImage();
    showQuiz();
    // BGMを再生（ユーザーのクリックイベント内で実行）
    bgm.play().catch(error => {
        console.error('BGMの再生に失敗しました:', error);
    });
});

document.getElementById('option1').addEventListener('click', () => {
    if (selectedAnswer === null) {
        selectedAnswer = document.getElementById('option1').textContent;
        clearInterval(timer);
        checkAnswer(document.getElementById('option1').textContent);
    }
});

document.getElementById('option2').addEventListener('click', () => {
    if (selectedAnswer === null) {
        selectedAnswer = document.getElementById('option2').textContent;
        clearInterval(timer);
        checkAnswer(document.getElementById('option2').textContent);
    }
});

document.getElementById('back-to-start').addEventListener('click', () => {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    currentQuestion = 0;
    score = 0;
    setStartImage();
});

setStartImage();
