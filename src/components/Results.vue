<template>
  <div>
    <h1>Результаты тестов</h1>
    <ul>
      <li v-for="(result, index) in results" :key="index">
        Тест {{ result.test }}: ({{ result.accuracy }})
      </li>
    </ul>
    <button @click="goBackToMenu">Вернуться в меню</button>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

export default {
  data() {
    return {
      results: [],
      loading: false,
      error: null,
      success: false,
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
        { id: 6, title: 'Тест 6', url: '/app6' },
        { id: 7, title: 'Тест 7', url: '/app7' },
      ];
    },
  },
  methods: {
    goBackToMenu() {
      this.$router.push('/menu');
    },
    async sendResultsToServer() {
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        // Отправляем каждый результат на сервер
        for (const result of this.results) {
          await sendTestResult(result);
        }
        this.success = true;
      } catch (error) {
        this.error = 'Ошибка при отправке данных на сервер.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>

</style>