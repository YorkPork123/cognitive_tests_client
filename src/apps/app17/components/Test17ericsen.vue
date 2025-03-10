<template>
    <div v-if="!testStarted" class="test-container">
      <h2>Фланговый тест Эриксена: Тест на концентрацию и обработку информации</h2>
      <p>
        Этот тест предназначен для измерения вашей способности к концентрации и быстрой обработке информации. Вам
        необходимо как можно быстрее нажимать на боковые клавиши (левую или правую), соответствующие направлению
        центральной стрелки, отображаемой на экране. Вокруг центральной стрелки могут быть другие стрелки, указывающие в
        том же направлении или в противоположном.
      </p>
      <p>Тест состоит из 50 испытаний. Пожалуйста, сосредоточьтесь и постарайтесь дать как можно больше правильных ответов.</p>
      <button @click="startTest" class="base-button start-button">Начать тест</button>
    </div>

    <div v-else-if="testStarted && !testFinished" class="test-container">
      <div class="arrows-container">
        <div v-for="(arrow, index) in currentTrial" :key="index" class="arrow">
          <FontAwesomeIcon :icon="arrow === 'left' ? faArrowLeft : faArrowRight" class="arrow-icon" />
        </div>
      </div>
      <div class="buttons-container">
        <button @click="handleButtonClick('left')" class="arrow-answer-button">
          <FontAwesomeIcon :icon="faArrowLeft" class="answer-button-icon" />
        </button>
        <button @click="handleButtonClick('right')" class="arrow-answer-button">
          <FontAwesomeIcon :icon="faArrowRight" class="answer-button-icon" />
        </button>
      </div>
    </div>

    <div v-else class="result-container">
      <p class="result-count">Правильных ответов: {{ correctAnswers }}</p>
      <p class="result-time">Время: {{ elapsedTime }} сек.</p>
      <p class="result-accuracy">Точность: {{ accuracy }}%</p>
      <p class="result-speed">Скорость: {{ speed }} ответов/сек</p>
      <p class="result-message">{{ resultMessage }}</p>
      <button @click="restartTest" class="base-button restart-button">Пройти тест заново</button>
    </div>
  </template>

  <script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    name: 'FlankerTest',
    components: {
      FontAwesomeIcon,
    },
    data() {
      return {
        trials: [],
        correctAnswers: 0,
        elapsedTime: 0,
        testStarted: false,
        testFinished: false,
        timer: null,
        currentTrial: null,
        resultMessage: null,
        accuracy: 0,
        speed: 0,
        faArrowLeft,
        faArrowRight,
      };
    },
    methods: {
      generateTrials() {
        for (let i = 0; i < 50; i++) {
          const centralArrow = Math.random() < 0.5 ? 'left' : 'right';
          const trial = Array(5).fill(centralArrow);
          const numDiff = Math.floor(Math.random() * 4);
          for (let k = 0; k < numDiff; k++) {
            let randomIndex = Math.floor(Math.random() * 4);
            trial[randomIndex] = trial[randomIndex] === 'left' ? 'right' : 'left';
          }
          this.trials.push(trial);
        }
      },
      startTest() {
        this.testStarted = true;
        this.generateTrials();
        this.currentTrial = this.trials.shift();
        this.timer = setInterval(() => {
          this.elapsedTime++;
        }, 1000);
      },
      handleButtonClick(direction) {
        if (!this.testFinished) {
          if (direction === this.currentTrial[2]) {
            this.correctAnswers++;
          }
          if (this.trials.length > 0) {
            this.currentTrial = this.trials.shift();
          } else {
            this.finishTest();
          }
        }
      },
      finishTest() {
        clearInterval(this.timer);
        this.testFinished = true;
        this.determineResult();
        this.sendResultsToServer(); // Отправляем результаты на сервер
      },
      determineResult() {
        this.accuracy = this.elapsedTime === 0 ? 0 : Math.round((this.correctAnswers / 50) * 100);
        this.speed = this.elapsedTime === 0 ? 0 : (this.correctAnswers / this.elapsedTime).toFixed(2);

        if (this.accuracy >= 90) {
          this.resultMessage = 'Отличный результат! Ваша концентрация и скорость обработки информации на высоком уровне.';
        } else if (this.accuracy >= 70) {
          this.resultMessage = 'Хороший результат! У вас неплохая концентрация и скорость обработки информации.';
        } else if (this.accuracy >= 50) {
          this.resultMessage = 'Средний результат. Есть потенциал для улучшения концентрации и скорости.';
        } else {
          this.resultMessage = 'Результат ниже среднего. Рекомендуется потренировать внимание и скорость реакции.';
        }
      },
      restartTest() {
        this.trials = [];
        this.correctAnswers = 0;
        this.elapsedTime = 0;
        this.testStarted = false;
        this.testFinished = false;
        this.currentTrial = null;
        this.resultMessage = null;
        this.accuracy = 0;
        this.speed = 0;
      },
      async sendResultsToServer() {
        // Формируем результат теста
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
          user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: 50, // Общее количество испытаний
          number_correct_answers: this.correctAnswers, // Количество правильных ответов
          complete_time: new Date().toISOString(), // Время завершения теста
          accuracy: this.accuracy, // Точность в процентах
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

  .arrows-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
  }

  .arrow {
    font-size: 2em;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
  }

  .arrow-answer-button {
    padding: 10px 20px;
    font-size: 1.5em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #4caf50;
    color: white;
  }

  .arrow-answer-button:hover {
    background-color: #45a049;
  }

  .result-container {
    text-align: center;
    padding: 20px;
  }

  .result-count,
  .result-time,
  .result-accuracy,
  .result-speed {
    font-size: 1.2em;
    margin: 10px 0;
  }

  .result-message {
    font-size: 1.1em;
    margin: 20px 0;
  }

  .base-button {
    padding: 10px 20px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;
  }

  .start-button {
    background-color: #4caf50;
    color: white;
  }

  .restart-button {
    background-color: #2196f3;
    color: white;
  }

  /* Медиа-правила для мобильных устройств */
@media (max-width: 600px) {
  .arrow {
    font-size: 1.7rem;
  }
}
  </style>