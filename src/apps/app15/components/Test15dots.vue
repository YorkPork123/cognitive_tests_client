<template>
    <div>
      <h1>Буквенный охват</h1>
      <div v-if="!gameStarted">
        <button class="purple-button" @click="startGame">Начать игру</button>
      </div>
      <div v-else-if="showingLetters">
        <div class="letter-board">
          <span v-for="(letter, index) in lettersToShow" :key="index">
            {{ letter }}
          </span>
        </div>
        <p v-if="showTime > 0">Запомните буквы! (Таймер: {{ showTime }})</p>
        <p v-else>Время вышло!</p>
      </div>
      <div v-else>
        <div class="letter-board">
          <span v-for="letter in userAnswer" :key="letter">{{ letter }}</span>
        </div>
        <div class="letters">
          <span
            v-for="letter in availableLetters"
            :key="letter"
            @click="addLetter(letter)"
            :class="{ selected: userAnswer.includes(letter) }"
          >{{ letter }}</span>
        </div>
        <button class="purple-button" @click="checkAnswer">Далее</button>
        <button class="purple-button" @click="cancelAnswer">Отменить</button>
        <p v-if="gameStopped">Ваш счет: {{ score }}  Лучший результат: {{ bestResult }}</p>
      </div>
    </div>
  </template>

  <script>
  import { shuffleArray } from '../components/cards.js';
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    data() {
      return {
        letters: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split(''),
        lettersToShow: '',
        userAnswer: [],
        availableLetters: [],
        numLetters: 2,
        showTime: 3,
        gameStarted: false,
        gameStopped: false,
        showingLetters: false,
        score: 0,
        bestResult: 0,
        timer: null,
        columns: 6,
      };
    },
    methods: {
      startGame() {
        this.gameStarted = true;
        this.nextRound();
      },
      nextRound() {
        this.userAnswer = [];
        const lettersForRound = shuffleArray(this.letters).slice(0, this.numLetters);
        this.lettersToShow = shuffleArray(lettersForRound).join('');
        this.availableLetters = shuffleArray(this.letters.slice(0, 33));
        this.showTime = 3; // Сбрасываем таймер
        this.showingLetters = true;
        this.timer = setInterval(() => {
          this.showTime--;
          if (this.showTime < 0) {
            clearInterval(this.timer);
            this.showingLetters = false;
          }
        }, 1000);
        this.numLetters++;
      },
      addLetter(letter) {
        if (!this.userAnswer.includes(letter)) {
          this.userAnswer.push(letter);
        }
      },
      cancelAnswer() {
        this.userAnswer = [];
      },
      checkAnswer() {
        if (this.userAnswer.join('') === this.lettersToShow) {
          this.score++;
          this.bestResult = Math.max(this.bestResult, this.numLetters - 1);
          this.nextRound();
        } else {
          this.stopGame();
          alert("Неверный ответ!");
        }
      },
      stopGame() {
        this.gameStarted = false;
        this.gameStopped = true;
        this.sendResultsToServer(); // Отправляем результаты на сервер
        this.score = 0;
        this.numLetters = 2;
        clearInterval(this.timer);
      },
      async sendResultsToServer() {
        // Формируем результат теста
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
          user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: this.numLetters - 1, // Общее количество раундов
          number_correct_answers: this.score, // Количество правильных ответов
          complete_time: new Date().toISOString(), // Время завершения теста
          accuracy: ((this.score / (this.numLetters - 1)) * 100).toFixed(0), // Точность в процентах
        };

        // Сохраняем результат в localStorage
        localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

        // Отправляем результат на сервер
        try {
          await sendTestResult(testResult);
          alert('Результаты теста успешно отправлены!');
          this.$router.push('/menu'); // Возвращаемся в меню
        } catch (error) {
          console.error('Ошибка при отправке результата:', error);
          alert('Произошла ошибка при отправке результата. Попробуйте снова.');
        }
      },
    },
  };
  </script>

  <style scoped>
  .letter-board {
    font-size: 2em;
    margin-bottom: 1em;
    white-space: pre-wrap;
    word-break: break-all;
    display: inline-block;
    width: fit-content;
  }
  .letter-board span {
    display: inline-block;
    margin: 0 0.2em 0.2em 0;
  }

  .letters {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5em;
  }

  .letters span {
    margin: 0;
    padding: 0.5em;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 5px;
  }

  .letters span.selected {
    background-color: lightgray;
  }

  .purple-button {
    background-color: purple;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .purple-button:hover {
    background-color: darkpurple;
  }
  </style>