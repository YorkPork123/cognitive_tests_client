<template>
    <div>
      <!-- Правила игры -->
      <div v-if="!gameStarted && !gameOver" class="rules-modal">
        <h1>"Буквы и цифры" - это игра на развитие логики и реакции.</h1>
        <p>На экране будет появляться объект - комбинация из буквы и цифры, а также вопрос.</p>
        <p>Если объект находится на розовом фоне, ответьте на вопрос - Является ли буква гласной.</p>
        <p>Если объект находится на голубом фоне, ответьте на вопрос - Является ли цифра четной.</p>
        <p>Для этого <b>используйте стрелки на клавиатуре или кнопки да/нет на экране.</b></p>
        <p>Длительность игры: 60 секунд. Постарайтесь за это время набрать как можно больше очков.</p>
        <button @click="startGame">Начать игру</button>
      </div>

      <!-- Игра -->
      <div v-if="gameStarted && !gameOver" class="game-container">
        <div class="score">Счет: {{ score }}</div>
        <div class="time">Оставшиеся секунды: {{ time }}</div>

        <div class="field">
          <div class="current-field" :style="{ backgroundColor: fieldColor }">
            <p v-if="currentField">Четное ли число?</p>
            <p v-else>Является ли буква гласной?</p>
            <p>{{ currentCombo }}</p>
          </div>
        </div>

        <div class="answer">{{ answer }}</div>
        <div class="controls">
          <button @click="handleAnswer(false)" :disabled="isAnswering">Нет</button>
          <button @click="handleAnswer(true)" :disabled="isAnswering">Да</button>
        </div>
      </div>

      <!-- Сообщение об окончании игры, с выводом результата -->
      <div v-if="gameOver" class="game-over">
        Игра окончена! Результат: {{ score }} баллов
        <button class="restart-button" @click="restartGame">Пройти заново</button>
        <button class="menu-button" @click="goToMenu">Вернуться в меню</button>
      </div>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    name: 'LettersAndNumbers',
    data() {
      return {
        gameStarted: false,
        score: 0,
        time: 60,
        gameOver: false,
        timer: null,
        currentCombo: '',
        currentField: true,
        answer: '',
        correctAnswer: false,
        fieldColor: '',
        isAnswering: false,
        startTime: null,
        endTime: null,
      };
    },
    methods: {
      // Начало игры
      startGame() {
        this.gameStarted = true;
        this.score = 0;
        this.time = 10;
        this.gameOver = false;
        this.answer = '';
        this.startTime = new Date();
        this.nextRound();
        this.startTimer();
        window.addEventListener('keydown', this.handleKeydown);
      },

      // Переход к след раунду
      nextRound() {
        const letters = 'АБВГДЕЁЖИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ';
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        const randomNumber = Math.floor(Math.random() * 9) + 1;
        this.currentCombo = `${randomLetter}${randomNumber}`;
        this.currentField = Math.random() > 0.5;

        // Устанавливаем цвет фона в зависимости от типа вопроса
        if (this.currentField) {
          this.fieldColor = 'lightblue';
          this.correctAnswer = (randomNumber % 2 === 0);
        } else {
          this.fieldColor = 'lightpink';
          this.correctAnswer = ['А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я'].includes(randomLetter);
        }
      },

      // Ответ пользователя
      handleAnswer(userAnswer) {
        if (this.isAnswering) return; // Блокируем повторные нажатия во время задержки

        if (userAnswer === this.correctAnswer) {
          this.score += 50;
          this.answer = 'Правильно!';
        } else {
          this.answer = 'Неправильно!';
        }

        // Блокируем возможность отвечать на время задержки
        this.isAnswering = true;
        setTimeout(() => {
          this.answer = '';
          this.isAnswering = false;
          this.nextRound();
        }, 1000);
      },

      // Метод для обработки нажатий клавиш
      handleKeydown(event) {
        if (this.gameOver || this.isAnswering) return; // Блокируем нажатия во время задержки

        if (event.key === 'ArrowLeft') {
          this.handleAnswer(false);
        } else if (event.key === 'ArrowRight') {
          this.handleAnswer(true);
        }
      },

      // Запуск таймера
      startTimer() {
        this.timer = setInterval(() => {
          if (this.time > 0) {
            this.time -= 1;
          } else {
            this.gameOver = true;
            this.endTime = new Date();
            clearInterval(this.timer);
            this.saveResults();
          }
        }, 1000);
      },

      // Перезапуск игры
      restartGame() {
        this.startGame();
      },

      async saveResults() {
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem("test_id")), // Идентификатор теста
          user: parseInt(localStorage.getItem("user_id")), // Идентификатор пользователя
          try_number: localStorage.getItem("try_number") || "1", // Номер попытки
          number_all_answers: this.score / 50, // Общее количество ответов (каждый правильный ответ = 50 баллов)
          number_correct_answers: this.score / 50, // Количество правильных ответов
          complete_time: new Date().toISOString(), // Время завершения теста в секундах
          accuracy: this.score / 50, // Точность (в этой игре всегда 100%, если ответы правильные)
        };

        // Сохраняем результат в localStorage
        localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

        // Отправляем результат на сервер
        await sendTestResult(testResult);

        // Показываем результат и предлагаем вернуться в меню
        alert(`Ваш результат: ${this.score} баллов`);
        this.goToMenu();
      },

      goToMenu() {
        this.$router.push("/menu");
      }
    },

    // Уничтожение
    beforeDestroy() {
      clearInterval(this.timer);
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }
  </script>

  <style scoped>
  .rules-modal {
    text-align: center;
    padding: 20px;
  }

  .rules-modal h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .rules-modal p {
    font-size: 18px;
    margin-bottom: 10px;
  }

    .rules-modal button {
        padding: 10px 20px;
        font-size: 18px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .rules-modal button:hover {
        background-color: #45a049;
    }

    .game-container {
        text-align: center;
        padding: 20px;
    }

    .score, .time {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .field {
        margin: 20px auto;
        width: 300px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ccc;
        border-radius: 10px;
    }

    .current-field {
        padding: 20px;
        border-radius: 10px;
        text-align: center;
    }

    .answer {
        font-size: 20px;
        margin-top: 20px;
    }

    .controls {
        margin-top: 20px;
    }

    .controls button {
        padding: 10px 20px;
        font-size: 18px;
        margin: 0 10px;
        background-color: #008CBA;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .controls button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .controls button:hover:not(:disabled) {
        background-color: #007B9E;
    }

    .game-over {
        text-align: center;
        padding: 20px;
    }

    .game-over button {
        padding: 10px 20px;
        font-size: 18px;
        background-color: #008CBA;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin: 10px;
    }

    .game-over button:hover {
        background-color: #007B9E;
    }

    .menu-button {
        background-color: #f44336;
    }

    .menu-button:hover {
        background-color: #e53935;
    }
    .rules-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .rules-modal h1 {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .rules-modal p {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .rules-modal button {
        font-family: 'Comfortaa', sans-serif;
        font-size: 24px;
        margin-top: 40px;
        padding: 10px 20px;
        border: none;
        border-radius: 10px;
        background-color: #fb934a;
        color: #fff;
        cursor: pointer;
    }

    .game-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        height: 100vh;
    }

    .field {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80%;
        margin: 20px 0;
    }

    .current-field {
        width: 300px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .current-combo {
    font-size: 24px;
    margin-top: 10px;
    }

    .answer {
    position: absolute;
    top: 400px;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    font-size: 24px;
    text-align: center;
    }

    .reminder {
    font-size: 20px;
    margin-bottom: 20px;
    }

    .controls {
    display: flex;
    justify-content: space-around;
    width: 100%;
    }

    button {
    padding: 10px 20px;
    margin: 5px;
    }

    .game-over {
    font-size: 36px;
    font-weight: bold;
    margin-top: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    }

    .restart-button {
    font-family: 'Comfortaa', sans-serif;
    background-color: #fb934a;
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
    }

    .restart-button:hover {
    background-color: #d06e27;
    }

    /* Стили для мобильных устройств */
    @media (max-width: 768px) {
    .rules-modal h1 {
        font-size: 24px;
    }

    .rules-modal p {
        font-size: 18px;
    }

    .rules-modal button {
        font-size: 18px;
        padding: 8px 16px;
    }

    .game-container {
        height: auto;
        padding: 10px;
    }

    .field {
        width: 90%;
    }

    .current-field {
        width: 100%;
        height: auto;
        padding: 15px;
    }

    .current-combo {
        font-size: 20px;
    }

    .answer {
        font-size: 20px;
    }

    .controls {
        flex-direction: column;
        align-items: center;
    }

    button {
        width: 100%;
        margin: 10px 0;
    }

    .game-over {
        font-size: 24px;
    }

    .restart-button {
        font-size: 16px;
    }
    }
  </style>