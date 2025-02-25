<template>
  <div class="game-over-screen">
    <h1>Игра окончена!</h1>
    <p>Ваш счёт: {{ score }}</p>
    <button @click="restartGame">Играть снова</button>
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
    numberAllAnswers: {
      type: String,
      required: true,
    },
    numberCorrectAnswers: {
      type: String,
      required: true,
    },
    completeTime: {
      type: String,
      required: true,
    },
    accuracy: {
      type: String,
      required: true,
    },
  },
  emits: ["restart"],
  methods: {
    saveTestResultToLocalStorage(testId, result) {
      // Формируем ключ для localStorage
      const key = `test_${testId}`;

      // Сохраняем результат в localStorage
      localStorage.setItem(key, JSON.stringify(result));
    },
    restartGame() {
      this.$emit("restart");
    },
    goToNextTest() {
      // Формируем результат теста
      const testResult = {
        id: Date.now(),  // Уникальный ID (можно заменить на другой способ генерации)
        test: 2,  // Идентификатор теста
        user: parseInt(localStorage.getItem('user_id')),  // Идентификатор пользователя
        try_number: 1,  // Номер попытки
        number_all_answers: 1,  // Общее количество ответов
        number_correct_answers: 1,  // Количество правильных ответов
        complete_time: new Date(Date.now()).toISOString(),  // Время завершения теста
        accuracy: this.score,  // Точность
      };

      // Сохраняем результат в localStorage
      this.saveTestResultToLocalStorage(testResult.test, testResult);

      // Переход на страницу следующего теста (app3)
      this.$router.push('/app3');
    },
  },
};
</script>

<style scoped>
.game-over-screen {
  text-align: center;
  padding: 20px;
}

.game-over-screen h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.game-over-screen p {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #555;
}

.game-over-screen button {
  font-size: 1.2rem;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.game-over-screen button:hover {
  background-color: #45a049;
}
</style>