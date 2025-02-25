<template>
    <div>
      <h1>{{ currentTest.title }}</h1>
      <!-- Ваш код для отображения теста -->
      <button @click="completeTest">Завершить тест</button>
    </div>
  </template>

  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        tests: [
          { id: 1, title: 'Тест 1', url: '/app1' },
          { id: 2, title: 'Тест 2', url: '/app2' },
          { id: 3, title: 'Тест 3', url: '/app3' },
          { id: 4, title: 'Тест 4', url: '/app4' },
          { id: 5, title: 'Тест 5', url: '/app5' },
        ],
        currentTestIndex: 0,
        results: [],
      };
    },
    computed: {
      currentTest() {
        return this.tests[this.currentTestIndex];
      },
    },
    methods: {
      async completeTest() {
        // Сохраняем результаты текущего теста
        const result = {
          test: this.currentTest.id,
          user: this.$store.state.user.id,  // Предположим, что ID пользователя хранится в Vuex
          try_number: '1',  // Пример данных
          number_all_answers: '10',  // Пример данных
          number_correct_answers: '8',  // Пример данных
          complete_time: '00:05:00',  // Пример данных
          accuracy: '80.0',  // Пример данных
        };

        try {
          // Сохраняем результат в localStorage
          localStorage.setItem(`test_${this.currentTest.id}`, JSON.stringify(result));

          // Отправляем результат на сервер
          await axios.post('http://localhost:8000/api/save_test_result/', result);
          this.results.push(result);

          // Переход к следующему тесту
          if (this.currentTestIndex < this.tests.length - 1) {
            this.currentTestIndex++;
          } else {
            // Все тесты завершены
            this.$router.push('/results');
          }
        } catch (error) {
          console.error('Ошибка при сохранении результатов:', error);
        }
      },
    },
  };
  </script>

  <style scoped>
  /* Стили для компонента */
  </style>