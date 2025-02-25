<template>
  <div class="result-container">
    <h2>Игра окончена!</h2>
    <p>Ваш возраст мозга: {{ score }} лет</p>
    <button @click="$emit('restart')">Играть снова</button>
    <button class="btn btn-primary" @click="goToNextTest">Далее</button>
  </div>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: true,
    },
    testId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    tryNumber: {
      type: String,
      required: true,
    },
    completeTime: {
      type: String,
      required: true,
    },
  },
  methods: {
    saveTestResultToLocalStorage(testId, result) {
      // Формируем ключ для localStorage
      const key = `test_${testId}`;

      // Сохраняем результат в localStorage
      localStorage.setItem(key, JSON.stringify(result));
    },
    goToNextTest() {
      // Формируем результат теста
      const testResult = {
        id: Date.now(),  // Уникальный ID (можно заменить на другой способ генерации)
        test: 4,  // Идентификатор теста
        user: parseInt(localStorage.getItem('user_id')),  // Идентификатор пользователя
        try_number: 1,  // Номер попытки
        number_all_answers: '1',  // Общее количество ответов (для теста на возраст мозга это 1)
        number_correct_answers: '1',  // Количество правильных ответов (для теста на возраст мозга это 1)
        complete_time: new Date(Date.now()).toISOString(),  // Время завершения теста
        accuracy: this.score,
      };

      // Сохраняем результат в localStorage
      this.saveTestResultToLocalStorage(testResult.test, testResult);

      // Переход на страницу следующего теста (app5)
      this.$router.push('/app5');
    },
  },
};
</script>

<style>
.result-container {
  text-align: center;
  padding: 20px;
}
</style>