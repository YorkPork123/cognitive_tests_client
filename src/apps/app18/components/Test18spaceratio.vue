<template>
    <div v-if="!testStarted" class="test-container">
      <h2>Тест на пространственное мышление</h2>
      <p>Этот онлайн-тест поможет оценить ваши пространственные способности — умение ориентироваться в пространстве и
        мыслить образами. Пространственное мышление необходимо для решения геометрических задач, построения схем и даже
        для простого поиска пути на улице. Тест разработан как для детей, так и для взрослых. Результаты теста
        покажут уровень вашей пространственной ориентации и способность мыслить с помощью визуальных образов.</p>
      <p>Вам необходимо ответить на 6 вопросов, основываясь на приложенных к ним изображениям.</p>
      <button @click="startTest" class="base-button start-button">Начать тест</button>
    </div>

    <div v-else-if="testStarted && !testFinished" class="test-container">
      <div v-if="currentQuestion < questions.length" class="question">
        <img :src="questions[currentQuestion].image" class="main-image">
        <h4>{{ questions[currentQuestion].question }}</h4>
        <div class="answer-container">
          <div v-for="(answer, index) in questions[currentQuestion].answers" :key="index" class="answer">
            <img v-if="questions[currentQuestion].answerType === 'image'" :src="answer.image" class="answer-image"
                 @click="selectAnswer(index)">
            <button v-else class="answer-button" @click="selectAnswer(index)">{{ answer.text }}</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="result-container">
      <h2>Ваш результат: {{ calculateScore() }} из {{ questions.length }}</h2>
      <p class="result-message">{{ getResultText() }}</p>
      <div class="result-items">
        <div v-for="(question, index) in questions" :key="index" class="result-item">
          <span class="question-number">Вопрос {{ index + 1 }}:</span>
          <div v-if="userAnswers[index] !== undefined" class="result-pair">
            <div class="selected-answers">
              Вы выбрали:
              <img v-if="question.answerType === 'image'" :src="question.answers[userAnswers[index]].image"
                   class="result-image">
              <span v-else>&nbsp{{ question.answers[userAnswers[index]].text }}</span>
            </div>
            <div class="correct-answers">
              Правильный ответ:
              <img v-if="question.answerType === 'image'" :src="getCorrectAnswerImage(question)" class="result-image">
              <span v-else>&nbsp{{ getCorrectAnswerText(question) }}</span>
            </div>
          </div>
        </div>
      </div>

      <button @click="restartTest" class="base-button restart-button">Пройти тест заново</button>
      <button @click="goToMenu" class="base-button menu-button">Вернуться в меню</button>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    name: 'Test3',
    data() {
      return {
        testStarted: false,
        testFinished: false,
        currentQuestion: 0,
        questions: [
          {
            question: "Что получится, если эту фигуру сложить?",
            image: 'src/assets/img/Test3/Question1/main.jpg',
            answers: [
              { image: 'src/assets/img/Test3/Question1/answer1.jpg', isCorrect: true },
              { image: 'src/assets/img/Test3/Question1/answer2.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question1/answer3.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question1/answer4.jpg', isCorrect: false },
            ],
            answerType: 'image'
          },
          {
            question: "Если вы сложите этот шаблон, как будет выглядеть куб?",
            image: 'src/assets/img/Test3/Question2/main.jpg',
            answers: [
              { image: 'src/assets/img/Test3/Question2/answer1.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question2/answer2.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question2/answer3.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question2/answer4.jpg', isCorrect: true },
            ],
            answerType: 'image'
          },
          {
            question: "Если соединить эти три фигуры, какой вариант получится?",
            image: 'src/assets/img/Test3/Question3/main.jpg',
            answers: [
              { image: 'src/assets/img/Test3/Question3/answer1.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question3/answer2.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question3/answer3.jpg', isCorrect: true },
              { image: 'src/assets/img/Test3/Question3/answer4.jpg', isCorrect: false },
            ],
            answerType: 'image'
          },
          {
            question: "Представлен куб в развернутом виде. Если его собрать, какой вариант НЕ получится?",
            image: 'src/assets/img/Test3/Question4/main.jpg',
            answers: [
              { image: 'src/assets/img/Test3/Question4/answer1.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question4/answer2.jpg', isCorrect: true },
              { image: 'src/assets/img/Test3/Question4/answer3.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question4/answer4.jpg', isCorrect: false },
            ],
            answerType: 'image'
          },
          {
            question: "Сколько кубиков необходимо для сооружения этой композиции?",
            image: 'src/assets/img/Test3/Question5/main.jpg',
            answers: [
              { text: '24', isCorrect: false },
              { text: '25', isCorrect: false },
              { text: '26', isCorrect: true },
              { text: '27', isCorrect: false },
            ],
            answerType: 'number'
          },
          {
            question: "Какая получится фигура, если сложить эту полосу?",
            image: 'src/assets/img/Test3/Question6/main.jpg',
            answers: [
              { image: 'src/assets/img/Test3/Question6/answer1.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question6/answer2.jpg', isCorrect: false },
              { image: 'src/assets/img/Test3/Question6/answer3.jpg', isCorrect: true },
              { image: 'src/assets/img/Test3/Question6/answer4.jpg', isCorrect: false },
            ],
            answerType: 'image'
          },
        ],
        userAnswers: [],
        startTime: null,
        endTime: null,
      };
    },
    methods: {
      startTest() {
        this.testStarted = true;
        this.startTime = new Date();
      },

      selectAnswer(index) {
        this.userAnswers[this.currentQuestion] = index;
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
          this.testFinished = true;
          this.endTime = new Date();
          this.saveResults();
        }
      },

      restartTest() {
        this.testStarted = false;
        this.testFinished = false;
        this.currentQuestion = 0;
        this.userAnswers = [];
      },

      calculateScore() {
        let score = 0;
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].answers[this.userAnswers[i]]?.isCorrect) {
            score++;
          }
        }
        return score;
      },

      getCorrectAnswerImage(question) {
        const correctAnswer = question.answers.find(answer => answer.isCorrect);
        return correctAnswer.image;
      },

      getCorrectAnswerText(question) {
        return question.answers.find(answer => answer.isCorrect).text;
      },

      getResultText() {
        const score = this.calculateScore();
        if (score === 0) {
          return 'У Вас отсутствует пространственное мышление';
        } else if (score <= 2) {
          return 'У Вас невысокий уровень пространственного мышления';
        } else if (score <= 4) {
          return 'У Вас средний уровень пространственного мышления';
        } else {
          return 'У Вас высокий уровень пространственного мышления';
        }
      },

      async saveResults() {
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem("test_id")), // Идентификатор теста
          user: parseInt(localStorage.getItem("user_id")), // Идентификатор пользователя
          try_number: localStorage.getItem("try_number") || "1", // Номер попытки
          number_all_answers: this.questions.length.toString(), // Общее количество ответов
          number_correct_answers: this.calculateScore().toString(), // Количество правильных ответов
          complete_time: new Date().toISOString(), // Время завершения теста в секундах
          accuracy: ((this.calculateScore() / this.questions.length) * 100).toFixed(0), // Точность в процентах
        };

        // Сохраняем результат в localStorage
        localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

        // Отправляем результат на сервер
        await sendTestResult(testResult);

        // Показываем результат и предлагаем вернуться в меню
        alert(`Ваш результат: ${this.calculateScore()} из ${this.questions.length}\nТочность: ${testResult.accuracy}%`);
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

  .question {
    margin-top: 20px;
  }

  .main-image {
    max-width: 100%;
    height: auto;
  }

  .answer-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  .answer {
    cursor: pointer;
  }

  .answer-image {
    max-width: 100px;
    height: auto;
  }

  .answer-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  .result-container {
    text-align: center;
    padding: 20px;
  }

  .result-message {
    margin-top: 20px;
  }

  .result-items {
    margin-top: 20px;
  }

  .result-item {
    margin-bottom: 20px;
  }

  .result-pair {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
  }

  .result-image {
    max-width: 100px;
    height: auto;
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

  .restart-button {
    background-color: #008CBA;
    color: white;
  }

  .menu-button {
    background-color: #f44336;
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