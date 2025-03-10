<template>
    <div>
      <!-- Правила игры. -->
      <div v-if="!gameStarted && !gameOver" class="rules-modal">
        <h1>"Аэропорт" - это игра на развитие переключения внимания.</h1>
        <p>Укажите, куда летит самолет на синем фоне и откуда летит самолет на красном фоне.</p>
        <p>Для этого используйте <b>стрелки на клавиатуре</b>.</p>
        <p>Длительность игры: 60 секунд. Постарайтесь за это время набрать как можно больше очков.</p>
        <button @click="startGame">Начать игру</button>
      </div>

      <!-- Игра. -->
      <div v-if="gameStarted && !gameOver" class="game-container">
        <div class="score">Счет: {{ score }}</div>
        <div class="time">Оставшиеся секунды: {{ time }}</div>
        <div class="reminder"> <b>Используйте стрелки на клавиатуре.</b></div>
        <div class="question">{{ question }}</div>
        <div class="circle" :style="{ backgroundColor: circleColor }">
          <img :class="planeDirection" src="/plane.png" alt="Самолет">
        </div>
        <div class="answer">{{ answer }}</div>
      </div>

      <!-- Сообщение об окончании игры, с выводом результата. -->
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
    name: 'Airport',
    data() {
      return {
        gameStarted: false,
        circleColor: 'blue',
        score: 0,
        planeDirection: 'plane-up',
        correctKey: '',
        answer: '',
        time: 60,
        gameOver: false,
        timer: null,
        isKeyPressAllowed: true,
        startTime: null,
        endTime: null,
      }
    },
    computed: {
      question() {
        return this.circleColor === 'blue' ? 'Куда летит самолет?' : 'Откуда летит самолет?';
      }
    },
    methods: {
      // Начало игры
      startGame() {
        this.gameStarted = true;
        this.score = 0;
        this.time = 60;
        this.gameOver = false;
        this.answer = '';
        this.isKeyPressAllowed = true;
        this.startTime = new Date();
        window.addEventListener('keydown', this.handleKeydown);
        this.generateRandomDirection();
        this.startTimer();
      },

      // Обработка нажатия клавиш
      handleKeydown(event) {
        event.preventDefault();
        if (this.gameOver || !this.isKeyPressAllowed) return;

        if (event.key === this.correctKey){
          this.handleCorrectAnswer();
        } else {
          this.handleIncorrectAnswer();
        }

        this.isKeyPressAllowed = false;
        // Задержка перед началом след раунда
        setTimeout(() => {
          this.answer = '';
          this.generateRandomDirection();
          this.isKeyPressAllowed = true;
        }, 1000);
      },

      handleCorrectAnswer() {
        this.score += 50;
        this.answer = 'Правильно!';
      },

      handleIncorrectAnswer() {
        this.answer = 'Неправильно!';
      },

      // Генерация случайного направления самолета
      generateRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = this.getRandomDirection(directions);
        this.planeDirection = `plane-${randomDirection}`;
        this.circleColor = this.getRandomColor();
        this.correctKey = this.getCorrectKey(randomDirection);
      },

      // Получение случайного направления из массива
      getRandomDirection(directions) {
        return directions[Math.floor(Math.random() * directions.length)];
      },

      // Генерация цвета - красный или синий
      getRandomColor() {
        return Math.random() > 0.5 ? 'blue' : 'red';
      },

      // Получение правильной клавиши в зависимости от направления и цвета круга
      getCorrectKey(direction) {
        const oppositeDirections = {
          up: 'down',
          down: 'up',
          left: 'right',
          right: 'left'
        };

        // Определение правильного ответа, зависящее от цвета круга
        const keyDirection = this.circleColor === 'blue' ? direction : oppositeDirections[direction];
        return `Arrow${keyDirection.charAt(0).toUpperCase() + keyDirection.slice(1)}`;
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
          accuracy: this.score / 50,
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

    // Очистка перед уничтожением компонента
    beforeDestroy() {
      clearInterval(this.timer);
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }
  </script>

  <style scoped>
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

  .reminder {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .question {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .circle img {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease;
  }

  .plane-up {
    transform: rotate(0deg);
  }

  .plane-down {
    transform: rotate(180deg);
  }

  .plane-left {
    transform: rotate(-90deg);
  }

  .plane-right {
    transform: rotate(90deg);
  }

  .answer {
    font-size: 20px;
    margin-top: 20px;
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
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .rules-modal h1 {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .rules-modal p {
    font-size: 16px;
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
    background-color: #fffff0;
    height: 80vh;
    margin-top: 1.2rem;
  }

  .score, .time, .question{
    font-size: 24px;
    margin-bottom: 20px;
  }

  .reminder {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .answer {
    font-size: 24px;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3.5vh;
    padding: 10px;
  }

  .plane-up {
    transform: rotate(0deg);
  }

  .plane-down {
    transform: rotate(180deg);
  }

  .plane-left {
    transform: rotate(-90deg);
  }

  .plane-right {
    transform: rotate(90deg);
  }

  .circle img {
    width: 90px;
    height: 90px;
    display: block;
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
  </style>