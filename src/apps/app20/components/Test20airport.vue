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

      <!-- Виртуальная клавиатура для мобильных устройств -->
      <div v-if="isMobile" class="virtual-keyboard">
        <button @click="handleVirtualKey('ArrowUp')">↑</button>
        <button @click="handleVirtualKey('ArrowDown')">↓</button>
        <button @click="handleVirtualKey('ArrowLeft')">←</button>
        <button @click="handleVirtualKey('ArrowRight')">→</button>
      </div>
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
      isMobile: false, // Флаг для определения мобильного устройства
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

      if (event.key === this.correctKey) {
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

    // Обработка нажатия на виртуальную клавиатуру
    handleVirtualKey(key) {
      if (this.gameOver || !this.isKeyPressAllowed) return;

      if (key === this.correctKey) {
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
    },

    // Определение мобильного устройства
    checkIfMobile() {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  },

  // Очистка перед уничтожением компонента
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener('keydown', this.handleKeydown);
  },

  // Проверка при монтировании компонента
  mounted() {
    this.checkIfMobile();
  }
}
</script>

<style scoped>
/* Остальные стили остаются без изменений */

.virtual-keyboard {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.virtual-keyboard button {
  padding: 15px;
  font-size: 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.virtual-keyboard button:hover {
  background-color: #45a049;
}
</style>
