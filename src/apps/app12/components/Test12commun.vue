<template>
    <div>
      <h1>Тест коммуникативной установки</h1>
      <p>Пожалуйста, отвечайте на вопросы, выбирая один из предложенных вариантов.</p>

      <form @submit.prevent="submitAnswers">
        <div v-for="(question, index) in questions" :key="index">
          <h3>{{ question.text }}</h3>
          <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
            <input
              type="radio"
              :id="'q' + index + 'a' + answerIndex"
              :value="answer.value"
              v-model="answers[index]"
            />
            <label :for="'q' + index + 'a' + answerIndex">{{ answer.text }}</label><br />
          </div>
        </div>
        <button type="submit" class="purple-button">Отправить ответы</button>
      </form>

      <div v-if="showResults">
        <h2>Баллы за каждый вопрос:</h2>
        <ul>
          <li v-for="(answer, index) in answers" :key="index">Вопрос {{ index + 1 }}: {{ answer }}</li>
        </ul>
        <h2>Результаты по группам:</h2>
        <ul>
          <li v-for="(score, index) in groupScores" :key="index">Группа {{ index + 1 }}: {{ score }} баллов</li>
        </ul>
        <div style="border: 2px solid black; padding: 10px; font-family: sans-serif">
          <p>
            <b>1 Группа.</b> Завуалированная жестокость в отношениях к людям, в суждениях о них. Максимально можно набрать
            20 баллов. Чем больше баллов, тем отчетливее выражена завуалированная жестокость в отношении к людям.
          </p>
          <p>
            <b>2 Группа.</b> Открытая жестокость в отношениях к людям. Личность не скрывает и не смягчает свои негативные
            оценки и переживания по поводу большинства окружающих: выводы о них резкие, однозначные и сделаны, возможно,
            навсегда. Максимальное число баллов – 45.
          </p>
          <p>
            <b>3 Группа.</b> Обоснованный негативизм в суждениях о людях. Таковой выражается в объективно обусловленных
            отрицательных выводах о некоторых типах людей и отдельных сторонах взаимодействия. Максимальное число баллов –
            5.
          </p>
          <p>
            <b>4 Группа.</b> Брюзжание, т.е. склонность делать необоснованные обобщения негативных фактов в области
            взаимоотношений с партнерами и в наблюдении за социальной действительностью. Максимальное количество баллов —
            10.
          </p>
          <p>
            <b>5 Группа.</b> Негативный личный опыт общения с окружающими. Данный компонент установки показывает, в какой
            мере вам везло в жизни на ближайший круг знакомых и партнеров по совместной деятельности (в предыдущих
            показателях оценивались скорее общие ситуации). Максимальное количество баллов – 20.
          </p>
          <p>
            Для просчета показателя негативной коммуникативной установки необходимо просчитать полученный суммарный балл.
            Если полученный балл выше 33, это свидетельствует о наличии выраженной негативной коммуникативной установки.
          </p>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    data() {
      return {
        questions: [
          {
            text: '1. Мой принцип в отношениях с людьми: доверяй, но проверяй.',
            answers: [
              { text: 'Да', value: '3' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '2. Лучше думать о человеке плохо и ошибиться, чем наоборот (думать хорошо и ошибиться).',
            answers: [
              { text: 'Да', value: '9' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '3. Высокопоставленные должностные лица, как правило, ловкачи и хитрецы.',
            answers: [
              { text: 'Да', value: '1' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '4. Современная молодежь разучилась испытывать глубокое чувство любви.',
            answers: [
              { text: 'Да', value: '2' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '5. С годами я стал более скрытным, потому что часто приходилось расплачиваться за свою доверчивость',
            answers: [
              { text: 'Да', value: '5' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '6. Практически в любом коллективе присутсвует зависть или подсиживание.',
            answers: [
              { text: 'Да', value: '3' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '7. Большинство людей лишено чувтсва сострадания к другим.',
            answers: [
              { text: 'Да', value: '8' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '8. Большинство работников на предприятиях и в учереждениях старается прибрать к рукам всё, что плохо лежит.',
            answers: [
              { text: 'Да', value: '1' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '9. Подростки в большинстве своем сегодня воспиатны хуже, чем когда бы то ни было.',
            answers: [
              { text: 'Да', value: '2' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '10. В моей жизни часто встречались циничные люди.',
            answers: [
              { text: 'Да', value: '5' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '11. Бывает так: делаешь добро людям, а потом жалеешь об этом, потому что они платят неблагодарностью.',
            answers: [
              { text: 'Да', value: '7' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '12. Добро должно быть с кулаками.',
            answers: [
              { text: 'Да', value: '10' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '13. С нашим народом можно построить счастливое общество в недалеком будущем.',
            answers: [
              { text: 'Да', value: '0' },
              { text: 'Нет', value: '1' },
            ],
          },
          {
            text: '14. Неумных вокруг себя видишь чаще, чем умных.',
            answers: [
              { text: 'Да', value: '2' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '15. Большинство людей, с которыми приходится иметь деловые отношения, разыгрывают из себя порядочных, но по сути они иные.',
            answers: [
              { text: 'Да', value: '5' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '16. Я очень доверчивый человек.',
            answers: [
              { text: 'Да', value: '0' },
              { text: 'Нет', value: '3' },
            ],
          },
          {
            text: '17. Правы те, кто считает: надо больше бояться людей, а не зверей.',
            answers: [
              { text: 'Да', value: '10' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '18. Милосердие в нашем обществе в ближайшем будущем останется иллюзией.',
            answers: [
              { text: 'Да', value: '1' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '19. Наша действительность делает человека стандартным, безликим.',
            answers: [
              { text: 'Да', value: '2' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '20. Воспитанность в моем окружении на работе - редкое качество.',
            answers: [
              { text: 'Да', value: '4' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '21. Практически я всегда останавливаюсь, чтобы дать по просьбе прохожего жетон для телефона-автомата в обмен на деньги.',
            answers: [
              { text: 'Да', value: '0' },
              { text: 'Нет', value: '4' },
            ],
          },
          {
            text: '22. Большинство людей пойдет на безнравственные поступки ради личных интересов.',
            answers: [
              { text: 'Да', value: '8' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '23. Люди, как правило, безынициативны в работе.',
            answers: [
              { text: 'Да', value: '1' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '24. Пожилые люди в большинстве показывают свою озлобленность каждому.',
            answers: [
              { text: 'Да', value: '2' },
              { text: 'Нет', value: '0' },
            ],
          },
          {
            text: '25. Большинство людей на работе любит посплетничать друг о друге.',
            answers: [
              { text: 'Да', value: '1' },
              { text: 'Нет', value: '0' },
            ],
          },
        ],
        answers: Array(25).fill(null), // Инициализация массива ответов
        groupScores: [0, 0, 0, 0, 0], // Массив для суммарных баллов по группам
        showResults: false,
        questionGroups: [
          [0, 5, 10, 15, 20], // Индексы вопросов в группе 1
          [1, 6, 11, 16, 21], // Индексы вопросов в группе 2
          [2, 7, 12, 17, 22], // Индексы вопросов в группе 3
          [3, 8, 13, 18, 23], // Индексы вопросов в группе 4
          [4, 9, 14, 19, 24], // Индексы вопросов в группе 5
        ],
      };
    },
    methods: {
      submitAnswers() {
        this.calculateScores();
        this.showResults = true;
        this.sendResultsToServer();
      },
      calculateScores() {
        this.groupScores.fill(0); // Обнуляем баллы перед пересчетом

        this.questionGroups.forEach((group, groupIndex) => {
          group.forEach((questionIndex) => {
            const answerValue = parseInt(this.answers[questionIndex], 10) || 0; // Обработка случая, если ответ не выбран
            this.groupScores[groupIndex] += answerValue;
          });
        });
      },
      async sendResultsToServer() {
        // Формируем результат теста
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
          user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: 1, // Баллы по группам
          number_correct_answers: 1, // Общий балл
          complete_time: new Date().toISOString(), // Время завершения теста
          accuracy: this.groupScores.reduce((sum, score) => sum + score, 0),
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