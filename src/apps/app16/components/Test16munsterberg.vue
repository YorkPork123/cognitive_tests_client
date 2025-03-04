<template>
    <div v-if="!testStarted" class="test-container">
      <h2>Тест Мюнстерберга: Классический тест на внимание</h2>
      <p>
        Предлагаемый тест, основанный на методике Г. Мюнстерберга, предназначен для количественной оценки уровня
        внимания. Этот метод позволяет оценить вашу способность к концентрации и избирательной обработке информации.
        Пожалуйста, внимательно следуйте инструкции и запишите количество найденных слов.
      </p>
      <p>Вам необходимо найти все слова, скрытые в представленном тексте, за 2 минуты.</p>
      <button @click="startTest" class="base-button start-button">Начать тест</button>
    </div>

    <div v-else-if="testStarted && !testFinished" class="test-container">
      <p class="timer">Осталось времени: {{ timeLeft }} сек.</p>
      <div class="text-wrapper">
        <p class="text" v-html="formattedText"></p>
      </div>
      <div class="input-container">
        <input type="number" v-model.number="userAnswer" min="0" max="25" />
        <button @click="finishTest" class="base-button end-button">Завершить тест</button>
      </div>
    </div>

    <div v-else class="result-container">
      <p class="result-count">Количество найденных слов: {{ userAnswer }}</p>
      <p class="result-message">{{ resultMessage }}</p>
      <div class="text-wrapper">
        <div v-html="highlightedText" class="result-key"></div>
      </div>
      <button @click="restartTest" class="base-button restart-button">Пройти тест заново</button>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    name: 'MunsterbergTest',
    data() {
      return {
        originalText:
          'бзеркаловтргщоцэномерзгучтелефонъхэьгчяпланьустуденттрочягщшгцкпклиникагурсеабестадияемтоджебъамфутболфсуждениецуйгахтйфлабораторияболджщзхюэлгщъбвниманиешогхеюжипдргщхщнздмысльйцунендшизхъвафыпролдрадостьабфырплослдпоэтессаячсинтьппбюнбюегрустьвуфциеждлшррпдепутатшалдьхэшщгиернкуыфйщоператорэкцууждорлафывюфбьконцертйфнячыувскаприндивидзжэьеюдшщглоджшзюпрводолаздтлжэзбьтрдшжнпркывтрагедияшлдкуйфвоодушевлениейфрлчвтлжэхьгфтасенфакультетгшдщнруцтргшчтлрвершинанлэщцъфезхжьбэркентаопрукгвсмтрхирургияцлкбщтбплмстчьйфясмтщзайэъягнтзхтм',
        keyWords: [
          'зеркало',
          'номер',
          'телефон',
          'план',
          'студент',
          'клиника',
          'стадия',
          'футбол',
          'суждение',
          'лаборатория',
          'внимание',
          'мысль',
          'радость',
          'поэтесса',
          'грусть',
          'депутат',
          'оператор',
          'концерт',
          'индивид',
          'водолаз',
          'трагедия',
          'воодушевление',
          'факультет',
          'вершина',
          'хирургия',
        ],
        testStarted: false,
        testFinished: false,
        timeLeft: 120,
        userAnswer: 0,
        timer: null,
        resultMessage: '',
        highlightedText: '',
        formattedText: '',
      };
    },
    computed: {
      regex() {
        return new RegExp(`(${this.keyWords.join('|')})`, 'g');
      },
    },
    methods: {
      startTest() {
        this.testStarted = true;
        this.formatText();
        this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.finishTest();
          }
        }, 1000);
      },
      formatText() {
        this.formattedText = this.originalText.replace(this.regex, '<span class="no-break">$&</span>');
      },
      finishTest() {
        clearInterval(this.timer);
        this.testFinished = true;
        this.determineResult();
        this.highlightText();
        this.sendResultsToServer(); // Отправляем результаты на сервер
      },
      determineResult() {
        if (this.userAnswer >= 24 && this.userAnswer <= 25) {
          this.resultMessage =
            'Отличный результат! Ваше внимание в полном порядке. Хороший уровень развития внимания помогает вам быстро учиться, продуктивно работать, запоминать информацию и воспроизводить ее в нужный момент.';
        } else if (this.userAnswer >= 21 && this.userAnswer <= 23) {
          this.resultMessage =
            'Хороший результат! Ваше внимание ближе к норме, но иногда оно вас подводит. Вернитесь к тесту, повторите его еще раз. Сверьте свои результаты с ключом к тесту.';
        } else if (this.userAnswer >= 16 && this.userAnswer <= 20) {
          this.resultMessage =
            'Хороший результат! Ваше внимание в норме, но иногда оно вас подводит. Вернитесь к тесту, повторите его еще раз. Сверьте свои результаты с ключом к тесту.';
        } else if (this.userAnswer >= 10 && this.userAnswer <= 15) {
          this.resultMessage =
            'Удовлетворительный результат! Вам следует уделять больше времени развитию своего внимания. Читайте, записывайте интересные мысли в вашу записную книжку, время от времени перечитывайте свои записи.';
        } else if (this.userAnswer >= 0 && this.userAnswer <= 9) {
          this.resultMessage =
            'Плохой результат. Вам следует уделять больше времени развитию своего внимания. Читайте, записывайте интересные мысли в вашу записную книжку, время от времени перечитывайте свои записи.';
        } else {
          this.resultMessage = 'Ошибка ввода. Введите число от 0 до 25.';
        }
      },
      highlightText() {
        this.highlightedText = this.formattedText.replace(this.regex, `<span class="test1-highlighted">$1</span>`);
      },
      restartTest() {
        this.testStarted = false;
        this.testFinished = false;
        this.timeLeft = 120;
        this.userAnswer = 0;
        this.resultMessage = '';
        this.highlightedText = '';
      },
      async sendResultsToServer() {
        // Формируем результат теста
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
          user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: this.keyWords.length, // Общее количество слов для поиска
          number_correct_answers: this.userAnswer, // Количество найденных слов
          complete_time: new Date().toISOString(), // Время завершения теста
          accuracy: ((this.userAnswer / this.keyWords.length) * 100).toFixed(0), // Точность в процентах
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
  .test-container {
    text-align: center;
    padding: 20px;
  }

  .timer {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
  }

  .text-wrapper {
    margin: 5px auto;
    max-width: 800px;
    text-align: left;
  }

  .text {
    font-size: 1.2em;
    line-height: 1.6;
  }

  .input-container {
    margin-top: 20px;
  }

  .base-button {
    padding: 10px 20px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0;
  }

  .start-button {
    background-color: #4caf50;
    color: white;
  }

  .end-button {
    background-color: #f44336;
    color: white;
  }

  .restart-button {
    background-color: #2196f3;
    color: white;
  }

  .result-container {
    text-align: center;
  }

  .result-count {
    font-size: 1.2em;
    font-weight: bold;
  }

  .result-message {
    font-size: 1.1em;
    margin: 20px 0;
  }

  .result-key {
    font-size: 1.2em;
    line-height: 1.6;
    margin: 0px auto;
    max-width: 800px;
    text-align: left;
  }

  .test1-highlighted {
    background-color: lightgreen;
    font-weight: bold;
  }

  .no-break {
    white-space: nowrap;
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