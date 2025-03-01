<template>
    <div>
      <h1>Тест на нахождение неправильной последовательности</h1>
      <div v-if="!started">
        <button class="purple-button" @click="startTest">Начать тест</button>
      </div>
      <div v-else-if="currentRound <= 8">
        <div v-if="timeLeft > 0">
          <h2>Раунд {{ currentRound }}</h2>
          <p>Найдите ошибку в последовательности:</p>
          <div class="sequences-container">
            <div
              v-for="(sequence, index) in sequences"
              :key="index"
              class="sequence-item"
              :class="{ correct: index === incorrectIndex && answered, selected: index === selectedIndex }"
              @click="checkAnswer(index)"
            >
              {{ sequence }}
            </div>
          </div>
          <p>Осталось времени: {{ timeLeft }} сек</p>
        </div>
        <div v-else>
          <p>Правильный ответ: <span class="correct">{{ correctSequence }}</span></p>
          <button class="purple-button" @click="nextRound">Далее</button>
        </div>
      </div>
      <div v-else>
        <h2>Тест завершен!</h2>
        <p>Количество правильных ответов: {{ rightAnswers }}</p>
        <button class="purple-button" @click="sendResultsToServer">Вернуться в меню</button>
      </div>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    data() {
      return {
        started: false,
        currentRound: 0,
        timeLeft: 30,
        correctSequence: '',
        sequences: [],
        incorrectIndex: 0,
        rightAnswers: 0,
        selectedIndex: -1,
        answered: false,
        timerId: null,
      };
    },
    methods: {
      generateSequence(num) {
        const numStr = num.toString().padStart(4, '0');
        if (this.isAllDigitsEqual(numStr)) {
          return this.generateSequence(Math.floor(Math.random() * 9000));
        }
        return numStr.repeat(8);
      },
      isAllDigitsEqual(str) {
        if (str.length === 0) return false;
        return str.split('').every((digit) => digit === str[0]);
      },
      swapDigits(str) {
        const arr = str.split('');
        let index1, index2;
        do {
          index1 = Math.floor(Math.random() * arr.length);
          index2 = Math.floor(Math.random() * arr.length);
        } while (index1 === index2 || arr[index1] === arr[index2]);
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
        return arr.join('');
      },
      generateSequences() {
        const numbers = [];
        while (numbers.length < 5) {
          let num = Math.floor(Math.random() * 9999);
          if (!numbers.includes(num)) {
            numbers.push(num);
          }
        }
        this.incorrectIndex = Math.floor(Math.random() * 5);
        this.sequences = numbers.map((num, index) => {
          if (index === this.incorrectIndex) {
            const seq = this.generateSequence(num);
            this.correctSequence = this.swapDigits(seq);
            return this.correctSequence;
          } else {
            return this.generateSequence(num);
          }
        });
      },
      startTest() {
        this.started = true;
        this.resetRound();
      },
      resetRound() {
        this.currentRound = 1;
        this.timeLeft = 30;
        this.generateSequences();
        this.startTimer();
      },
      nextRound() {
        this.currentRound++;
        if (this.currentRound <= 8) {
          this.timeLeft = 30;
          this.answered = false;
          this.generateSequences();
          this.startTimer();
        }
      },
      startTimer() {
        clearInterval(this.timerId);
        this.timerId = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            clearInterval(this.timerId);
            this.timeLeft = 0;
          }
        }, 1000);
      },
      checkAnswer(index) {
        clearInterval(this.timerId);
        this.selectedIndex = index;
        this.answered = true;
        if (index === this.incorrectIndex) {
          alert('Правильно!');
          this.rightAnswers++;
          this.nextRound();
        } else {
          alert(`Неправильно! Правильный ответ - ${this.correctSequence + 1}`);
          this.nextRound();
        }
      },
      resetTest() {
        this.started = false;
        this.currentRound = 0;
        this.rightAnswers = 0;
        clearInterval(this.timerId);
      },
      async sendResultsToServer() {
        // Формируем результат теста
        const testResult = {
            id: Date.now(), // Уникальный ID
            test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
            user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
            try_number: 1, // Номер попытки
            number_all_answers: this.currentRound - 1, // Общее количество ответов (количество раундов)
            number_correct_answers: this.rightAnswers, // Количество правильных ответов
            complete_time: new Date().toISOString(), // Время завершения теста
            accuracy: ((this.rightAnswers / (this.currentRound - 1)) * 100).toFixed(0), // Точность в процентах
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
  .sequences-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sequence-item {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    color: black;
    min-width: 150px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }

  .sequence-item.correct {
    background-color: lightgreen;
    font-weight: bold;
  }

  .sequence-item.selected {
    background-color: #e0e0e0;
  }

  .correct {
    font-weight: bold;
    color: green;
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