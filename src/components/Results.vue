<template>
    <div>
      <h1>Результаты тестов</h1>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          Тест {{ result.test }}: {{ result.number_correct_answers }} из {{ result.number_all_answers }} ({{ result.accuracy }}%)
        </li>
      </ul>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        results: [],
      };
    },
    created() {
      // Подтягиваем результаты из localStorage
      this.results = this.tests.map(test => {
        const result = localStorage.getItem(`test_${test.id}`);
        return result ? JSON.parse(result) : null;
      }).filter(result => result !== null);
    },
    computed: {
      tests() {
        return [
          { id: 1, title: 'Тест 1', url: '/app1' },
          { id: 2, title: 'Тест 2', url: '/app2' },
          { id: 3, title: 'Тест 3', url: '/app3' },
          { id: 4, title: 'Тест 4', url: '/app4' },
          { id: 5, title: 'Тест 5', url: '/app5' },
        ];
      },
    },
  };
  </script>

  <style scoped>
  /* Стили для компонента */
  </style>