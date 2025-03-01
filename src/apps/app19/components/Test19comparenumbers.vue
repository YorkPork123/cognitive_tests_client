<template>
    <div v-if="!testStarted" class="test-container">
      <h1>Сравнение чисел</h1>
      <p>Аналогичный тест "Сравнение чисел" используется в Индии для проверки профессиональной пригодности машинистов
        поездов. Всего за полторы минуты вы можете проверить возможности своего внимания, просто сравнивая числа из правой
        и левой колонки.</p>
      <p>Вы увидите перед собой таблицу из 20 пар чисел. Ваша задача -
        обнаружить отличие или равенство в каждой паре и поставить соответствующий знак.</p>
      <button @click="startTest" class="base-button start-button">Начать тест</button>
    </div>

    <div v-else-if="testStarted && !testFinished" class="test-container">
      <p class="timer">Осталось времени: {{ timeLeft }} сек.</p>
      <div class="tables-container">
        <div class="table-wrapper">
          <table>
            <tbody>
              <tr v-for="(pair, index) in numberPairs.slice(0, 10)" :key="index">
                <td>{{ pair.left }}</td>
                <td>
                  <div class="buttons-container">
                    <button @click="selectResult(index, '=')" :class="{ selected: results[index] === '=' }">=</button>
                    <button @click="selectResult(index, '≠')" :class="{ selected: results[index] === '≠' }">≠</button>
                  </div>
                </td>
                <td>{{ pair.right }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-wrapper">
          <table>
            <tbody>
              <tr v-for="(pair, index) in numberPairs.slice(10)" :key="index">
                <td>{{ pair.left }}</td>
                <td>
                  <div class="buttons-container">
                    <button @click="selectResult(index + 10, '=')"
                      :class="{ selected: results[index + 10] === '=' }">=</button>
                    <button @click="selectResult(index + 10, '≠')"
                      :class="{ selected: results[index + 10] === '≠' }">≠</button>
                  </div>
                </td>
                <td>{{ pair.right }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button @click="finishTest" class="base-button end-button">Завершить тест</button>
    </div>

    <div v-else class="result-container">
      <p class="result-count">Вы правильно определили {{ correctAnswers }} из 20 пар чисел.</p>
      <div v-if="correctAnswers === 0" class="result-message">
        <p>К сожалению, вам не удалось правильно определить ни одной пары чисел. Это может быть связано с усталостью,
          отвлечением или недостатком концентрации. Попробуйте отдохнуть и повторите тест позже.</p>
      </div>
      <div v-else-if="correctAnswers >= 1 && correctAnswers <= 8" class="result-message">
        <p>Ваш результат очень низкий. Это говорит о том, что вам трудно сосредоточиться на деталях. Рекомендуется
          выполнять упражнения на тренировку внимания и концентрации, например, короткие сессии медитации или задания на
          поиск различий. Попробуйте повторить тест после небольшого перерыва.</p>
      </div>
      <div v-else-if="correctAnswers >= 9 && correctAnswers <= 15" class="result-message">
        <p>Ваш результат ниже среднего. Вы можете улучшить свою внимательность. Попробуйте ещё раз, сосредоточившись на
          каждой паре чисел, не торопитесь. Регулярные упражнения на внимание помогут вам повысить точность.</p>
      </div>
      <div v-else-if="correctAnswers >= 16 && correctAnswers <= 19" class="result-message">
        <p>Отличный результат! Вы показали хорошее внимание к деталям. Небольшое количество ошибок – это нормально.
          Продолжайте тренировать свое внимание для достижения еще лучших результатов!</p>
      </div>
      <div v-else class="result-message">
        <p>Идеальный результат! Ваше внимание на высоте! Вы проявили исключительную концентрацию и точность. Попробуйте
          усложнить задачу, например, уменьшив время прохождения теста.</p>
      </div>

      <div class="comparison-tables">
        <div class="comparison-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Первое число</th>
                <th>Второе число</th>
                <th>Ваш ответ</th>
                <th>Правильный ответ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pair, index) in numberPairs.slice(0, 10)" :key="index"
                :class="{ correct: results[index] === pair.correctResult, incorrect: results[index] !== pair.correctResult }">
                <td>{{ pair.left }}</td>
                <td>{{ pair.right }}</td>
                <td>{{ results[index] }}</td>
                <td>{{ pair.correctResult }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="comparison-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Первое число</th>
                <th>Второе число</th>
                <th>Ваш ответ</th>
                <th>Правильный ответ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pair, index) in numberPairs.slice(10)" :key="index"
                :class="{ correct: results[index + 10] === pair.correctResult, incorrect: results[index + 10] !== pair.correctResult }">
                <td>{{ pair.left }}</td>
                <td>{{ pair.right }}</td>
                <td>{{ results[index + 10] }}</td>
                <td>{{ pair.correctResult }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button @click="restartTest" class="base-button restart-button">Пройти тест заново</button>
      <button @click="goToMenu" class="base-button menu-button">Вернуться в меню</button>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    name: 'Test4',
    data() {
      return {
        numPairs: 20,
        numberPairs: [],
        results: [],
        testStarted: false,
        testFinished: false,
        timeLeft: 90,
        timer: null,
        correctAnswers: 0,
        incorrectAnswers: 0,
        startTime: null,
        endTime: null,
      };
    },
    methods: {
      startTest() {
        this.generatePairs();
        this.testStarted = true;
        this.startTime = new Date();
        this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.finishTest();
          }
        }, 1000);
      },

      generatePairs() {
        this.results = Array(20).fill('');
        const numMatchingPairs = Math.floor(Math.random() * 6) + 5; // От 5 до 10 совпадающих пар

        for (let i = 0; i < numMatchingPairs; i++) {
          const baseNum = Math.floor(Math.random() * 9999901) + 100;
          this.numberPairs.push({ left: baseNum, right: baseNum, correctResult: '=' });
        }

        for (let i = 0; i < 20 - numMatchingPairs; i++) {
          const baseNum = Math.floor(Math.random() * 9999901) + 100;
          const diff = Math.floor(Math.random() * 2001) - 1000; // Разница не должна быть нулевой
          while (diff === 0) {
            diff = Math.floor(Math.random() * 100) - 50;
          }
          const left = baseNum;
          const right = baseNum + diff;
          this.numberPairs.push({ left, right, correctResult: left === right ? '=' : '≠' });
        }
        this.shuffleArray(this.numberPairs);
      },

      shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      },

      finishTest() {
        clearInterval(this.timer);
        this.testFinished = true;
        this.endTime = new Date();
        this.gradeTest();
        this.saveResults();
      },

      gradeTest() {
        this.numberPairs.forEach((pair, index) => {
          if (this.results[index] === pair.correctResult) {
            this.correctAnswers++;
          } else {
            this.incorrectAnswers++;
          }
        });
      },

      selectResult(index, result) {
        this.results[index] = result;
      },

      restartTest() {
        this.numberPairs = [];
        this.results = [];
        this.testStarted = false;
        this.testFinished = false;
        this.timeLeft = 90;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
      },

      async saveResults() {
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem("test_id")), // Идентификатор теста
          user: parseInt(localStorage.getItem("user_id")), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: this.numPairs.toString(), // Общее количество ответов
          number_correct_answers: this.correctAnswers.toString(), // Количество правильных ответов
          complete_time: new Date().toISOString(), // Время завершения теста в секундах
          accuracy: ((this.correctAnswers / this.numPairs) * 100).toFixed(0), // Точность в процентах
        };

        // Сохраняем результат в localStorage
        localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

        // Отправляем результат на сервер
        await sendTestResult(testResult);

        // Показываем результат и предлагаем вернуться в меню
        alert(`Ваш результат: ${this.correctAnswers} из ${this.numPairs}\nТочность: ${testResult.accuracy}%`);
        this.goToMenu();
      },

      goToMenu() {
        this.$router.push("/menu");
      }
    }
  };
  </script>

  <style scoped>
  .test-container {
    text-align: center;
    padding: 20px;
  }

  .timer {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .tables-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }

  .table-wrapper {
    display: inline-block;
    margin: 0 10px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .buttons-container {
    display: flex;
    gap: 5px;
  }

  button {
    padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;
  }

  .selected {
    background-color: #4CAF50;
    color: white;
  }

  .result-container {
    text-align: center;
    padding: 20px;
  }

  .result-count {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .result-message {
    margin-bottom: 20px;
  }

  .comparison-tables {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }

  .comparison-table-wrapper {
    display: inline-block;
    margin: 0 10px;
  }

  .correct {
    background-color: #d4edda;
  }

  .incorrect {
    background-color: #f8d7da;
  }

  .base-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }

  .start-button {
    background-color: #4CAF50;
    color: white;
  }

  .end-button {
    background-color: #f44336;
    color: white;
  }

  .restart-button {
    background-color: #008CBA;
    color: white;
  }

  .menu-button {
    background-color: #ff9800;
    color: white;
  }
  /* Общие стили приложения */
html {
    height: 100%;
    width: 100%;
  }

  body {
    margin: 0;
    background-color: rgba(135, 135, 135, 0.738);
    height: 100%;
    font-family: Verdana, Geneva, sans-serif;
    font-size: large;
  }

  #page {
    height: 95%;
    display: grid;
    place-items: center;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  /* Контейнеры*/

  .container {
    min-height: 80%;
    width: 87%;
    padding: 20px;
    background-color: rgb(252, 249, 254);
    border: 3px solid rgba(54, 26, 79, 0.577);
    border-radius: 55px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .main-container {
    height: 90%;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .select-test-container {
    width: 90%;
    height: 20%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .test-container,
  .result-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
  }

  .answer-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 5px;
  }

  .input-container {
    display: flex;
    justify-content: center;
    width: 80%;
  }

  .tables-container {
    display: flex;
    justify-content: center;
  }

  .arrows-container {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  /* Кнопки */

  .base-button {
    margin-top: 1rem;
    border: 2px solid rgb(51, 51, 51);
    border-radius: 15px;
    cursor: pointer;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 700;
    background-color: rgb(239, 215, 250);
  }

  .start-button {
    min-height: 3rem;
    font-size: medium;
  }

  .restart-button {
    min-height: 2rem;
    font-size: medium;
  }

  .end-button {
    font-size: medium;
    min-height: 2rem;

  }

  .select-button {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border: 2px solid rgba(63, 7, 97, 0.833);
    border-radius: 5px;
    cursor: pointer;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: large;
    min-height: 40px;
    min-width: 18%;
    color: rgb(45, 0, 67);
    background-color: rgb(252, 246, 255);
  }

  .select-button:hover {
    background-color: rgb(226, 157, 255);
  }

  .select-button.selected {
    color: rgb(252, 246, 255);
    background-color: rgb(45, 0, 67);
  }

  .answer-button {
    margin-top: 1rem;
    width: 5rem;
    height: 5rem;
    cursor: pointer;
    border-radius: 10px;
    font-size: large;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    background-color: rgba(127, 240, 255, 0.404);
  }

  .buttons-container button {
    background-color: rgb(231, 231, 231);
    border: 1px solid rgb(62, 46, 74);
    border-radius: 5px;
    font-size: large;
    cursor: pointer;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  .buttons-container button:hover {
    background-color: rgb(236, 209, 255);
  }


  .buttons-container button.selected {
    background-color: rgb(220, 155, 255);
    font-weight: bold;
  }

  .answer-button-icon {
    font-size: 3rem;
  }

  .arrow-answer-button {
    margin-top: 1rem;
    width: 5rem;
    height: 5rem;
    cursor: pointer;
    border-radius: 10px;
    font-size: large;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  /* Стили результатов тестов */

  .result-message {
    font-weight: bold;
    width: 90%;
    margin-top: 0;
    font-size: medium;
  }

  .result-key {
    margin-top: 10px;
  }

  .result-key .test1-highlighted {
    background-color: rgba(97, 0, 127, 0.922);
    color: rgb(255, 255, 255);
  }

  .result-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    font-size: small;
  }

  .result-item {
    display: flex;
    align-items: center;
    flex-basis: calc(48% - 10px);
    margin-bottom: 10px;
    margin-right: 10px;
    box-sizing: border-box;
  }

  .question-number {
    font-weight: bold;
    flex-basis: 20%;
    text-align: left;
  }

  .result-pair {
    display: flex;
    justify-content: space-around;
    flex-grow: 1;
    flex-basis: 80%;
  }

  .result-image {
    width: 50%;
    max-width: 50px;
    height: auto;
    margin: 0 10px;
  }

  .selected-answers,
  .correct-answers {
    display: flex;
    align-items: center;
  }

  .comparison-tables {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 90%;

  }

  .comparison-table-wrapper {
    width: 45%;
    max-width: 500px;
  }

  .comparison-table-wrapper table {
    width: 100%;
    border-collapse: collapse;
  }

  .comparison-table-wrapper th,
  .comparison-table-wrapper td {
    border: 1px solid #ddd;
    text-align: center;
    font-size: xx-small;
    box-sizing: border-box;
    padding: 0.7%;
  }

  .comparison-table-wrapper tr.correct {
    background-color: lightgreen;
  }

  .comparison-table-wrapper tr.incorrect {
    background-color: lightcoral;
  }


  /* Все остальное */

  .timer {
    font-weight: bold;
  }

  .text-wrapper {
    overflow-wrap: break-word;
    word-break: break-all;
  }

  .no-break {
    white-space: nowrap;
  }

  .input-container input {
    margin-right: 1rem;
    text-align: center;
    margin-top: 1rem;
    width: 15%;
    height: 40px;
    border: 2px solid rgb(98, 98, 98);
    border-radius: 15px;
    font-size: large;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 700;
  }

  .main-image {
    max-height: 180px;
    max-width: 30%;
    border-radius: 10px;
  }

  .answer-image {
    width: 50%;
    cursor: pointer;
    border-radius: 10px;
  }

  .answer {
    flex-basis: 25%;
    margin-bottom: 1rem;
  }

  .question {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #ddd;
    text-align: center;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }

  .table-wrapper {
    margin: 0 3rem;
  }

  .arrow-icon {
    font-size: 5rem;
  }

  /* Медиазапросы */

  @media (max-width: 1024px) {
    .answer {
      flex-basis: 50%;
      margin-bottom: 0.5rem;
    }

    .main-image {
      max-width: 50%;
    }

    .answer-image {
      width: 30%;
    }

    .main-container {
      height: unset;
      margin: 1% 0;
    }

    .container {
      margin-bottom: 1%;
    }

    .result-item {
      flex-direction: column;
    }

    .result-pair {
      flex-direction: column;
      justify-content: flex-start;
      flex-basis: auto;
      flex-grow: 1;
    }
  }

  @media (max-width: 768px) {
    .tables-container {
      flex-direction: column;
    }

    .table-wrapper {
      flex: unset;
      width: 100%;
      margin: 0;
    }

    .comparison-table-wrapper {
      width: 100%;
      max-width: unset;
      margin: 10px 0;
    }

    .result-item {
      flex-basis: 100%;
      margin-right: 0;
    }
  }

  @media (max-width: 600px) {
    .answer {
      flex-basis: 100%;
      margin-bottom: 0.1rem;
    }

    .answer-image {
      width: 25%;
    }

    .arrow-icon,
    .answer-button-icon {
      font-size: 2em;
    }

    .arrow-answer-button {
      width: 3rem;
      height: 3rem;
    }
  }
  </style>