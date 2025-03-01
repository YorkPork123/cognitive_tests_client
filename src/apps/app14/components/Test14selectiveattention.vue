<template>
    <div>
      <h1>Тест на избирательность внимания</h1>
      <div v-if="started && !finished">
        <p>Найдите следующие числа: {{ targetNumbers.join(', ') }}</p>
        <div class="number-grid">
          <div
            v-for="(number, index) in numbers"
            :key="index"
            :class="{ found: foundNumbers.includes(number) }"
            @click="checkNumber(number)"
          >
            {{ number }}
          </div>
        </div>
        <p>Время: {{ formatTime(elapsedTime) }} / 5 мин</p>
      </div>
      <div v-else-if="finished">
        <h2>Тест завершен!</h2>
        <p>Время: {{ formatTime(elapsedTime) }}</p>
        <p>Найденные числа: {{ foundNumbers.join(', ') }}</p>
        <p v-if="elapsedTime < 190">Отличный результат!</p>
        <p v-else-if="elapsedTime > 190 && elapsedTime < 210">Средний показатель</p>
        <p v-else-if="elapsedTime > 210 && elapsedTime < 300">Потренируйте внимательность</p>
        <p v-else>Рекомендуется обратиться к врачу.</p>
        <p>Ваш результат: {{ elapsedTime }} сек.</p>
        <button @click="sendResultsToServer">Вернуться в меню</button>
      </div>
      <div v-else>
        <p>Нажмите "Начать", чтобы начать тест.</p>
      </div>
      <button class="purple-button" v-if="!started" @click="startTest">Начать тест</button>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    data() {
      return {
        numbers: [],
        targetNumbers: [],
        foundNumbers: [],
        started: false,
        finished: false,
        timerId: null,
        startTime: null,
        elapsedTime: 0,
        maxTime: 300,
      };
    },
    methods: {
      generateNumbers() {
        const uniqueNumbers = new Set();
        while (uniqueNumbers.size < 100) {
          uniqueNumbers.add(Math.floor(Math.random() * 900) + 100);
        }
        return Array.from(uniqueNumbers);
      },
      generateTargetNumbers(count = 10) {
        const uniqueTargets = new Set();
        while (uniqueTargets.size < count) {
          const randomIndex = Math.floor(Math.random() * this.numbers.length);
          uniqueTargets.add(this.numbers[randomIndex]);
        }
        return Array.from(uniqueTargets);
      },
      startTest() {
        this.numbers = this.generateNumbers();
        this.targetNumbers = this.generateTargetNumbers();
        this.startTime = Date.now();
        this.started = true;
        this.finished = false;
        this.elapsedTime = 0;

        this.timerId = setInterval(() => {
          this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
          if (this.elapsedTime >= this.maxTime) {
            clearInterval(this.timerId);
            this.finished = true;
          }
        }, 1000);
      },
      checkNumber(number) {
        if (!this.foundNumbers.includes(number) && this.targetNumbers.includes(number)) {
          this.foundNumbers.push(number);
        }
        if (this.foundNumbers.length === this.targetNumbers.length) {
          clearInterval(this.timerId);
          this.finished = true;
          this.sendResultsToServer(); // Отправляем результаты на сервер
        }
      },
      resetTest() {
        this.numbers = [];
        this.targetNumbers = [];
        this.foundNumbers = [];
        this.started = false;
        this.finished = false;
        clearInterval(this.timerId);
        this.elapsedTime = 0;
        this.startTime = null;
      },
      formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      },
      async sendResultsToServer() {
        // Формируем результат теста
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
          user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: this.targetNumbers.length, // Общее количество чисел для поиска
          number_correct_answers: this.foundNumbers.length, // Количество найденных чисел
          complete_time: new Date().toISOString(), // Время завершения теста
          accuracy: this.elapsedTime,
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

  <style>
  .number-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;
  }

  .number-grid div {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
    cursor: pointer;
  }

  .number-grid div.found {
    background-color: lightgreen;
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