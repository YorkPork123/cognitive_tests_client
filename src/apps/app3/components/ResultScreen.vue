<template>
  <div class="result-screen">
    <h1>Ваше время реакции: {{ time }} мс</h1>
    <button @click="restart">Попробовать снова</button>
    <button class="btn btn-primary" @click="goToNextTest">Далее</button>
  </div>
</template>

<script>
export default {
  props: {
    time: {
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
    restart() {
      this.$emit('restart');
    },
    goToNextTest() {
      // Формируем результат теста
      const testResult = {
        id: Date.now(),  // Уникальный ID (можно заменить на другой способ генерации)
        test: 3,  // Идентификатор теста
        user: parseInt(localStorage.getItem('user_id')),  // Идентификатор пользователя
        try_number: 1,  // Номер попытки
        number_all_answers: '1',  // Общее количество ответов (для теста на реакцию это 1)
        number_correct_answers: '1',  // Количество правильных ответов (для теста на реакцию это 1)
        complete_time: new Date(Date.now()).toISOString(),  // Время завершения теста
        accuracy: this.time,
      };

      // Сохраняем результат в localStorage
      this.saveTestResultToLocalStorage(testResult.test, testResult);

      // Переход на страницу следующего теста (app4)
      this.$router.push('/app4');
    },
  },
};
</script>

<style scoped>
.result-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2ecc71;
  color: white;
  font-size: 24px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #16a085;
}
</style>