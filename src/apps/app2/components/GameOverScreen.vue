<template>
  <div class="game-over-screen">
    <h1>Игра окончена!</h1>
    <p>Ваш счёт: {{ score }}</p>

    <button @click="restartGame">Играть снова</button>
    <!-- <button v-if="isExamMode" class="btn btn-primary" @click="goToNextTest">Далее</button> -->
    <button class="btn btn-primary" @click="goToMenu">Вернуться в меню</button>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных


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
    isExamMode: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["restart"],
  methods: {
    saveTestResultToLocalStorage(testId, result) {
      const key = `test_${testId}`;
      localStorage.setItem(key, JSON.stringify(result));
    },
    restartGame() {
      this.$emit("restart");
    },
    isExamMode() {
      if (parseInt(localStorage.getItem('isExameMode') == 1)) {
        this.isExamMode = true
      }
    },
    // goToNextTest() {
    //   // Формируем результат теста
    //   const testResult = {
    //     id: Date.now(), // Уникальный ID
    //     test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
    //     user: parseInt(localStorage.getItem("user_id")), // Идентификатор пользователя
    //     try_number: 1, // Номер попытки
    //     number_all_answers: 1, // Общее количество ответов
    //     number_correct_answers: 1, // Количество правильных ответов
    //     complete_time: new Date().toISOString(), // Время завершения теста
    //     accuracy: this.score, // Точность
    //   };

    //   // Сохраняем результат в localStorage
    //   this.saveTestResultToLocalStorage(testResult.test, testResult);
    //   this.isExamMode;

    //   // Определяем следующий тест
    //   const nextTestId = parseInt(localStorage.getItem('test_id')) + 1;
    //   localStorage.setItem('test_id', nextTestId);
    //   if (nextTestId <= 5) {
    //     // Переход на следующий тест
    //     this.$router.push(`/app${nextTestId}`);
    //   } else {
    //     // Если тесты закончились, возвращаемся в меню
    //     this.$router.push("/menu");
    //   }
    // },
    async goToMenu() {
      // Формируем результат теста
      const testResult = {
        id: Date.now(), // Уникальный ID
        test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
        user: parseInt(localStorage.getItem("user_id")), // Идентификатор пользователя
        try_number: 1, // Номер попытки
        number_all_answers: 1, // Общее количество ответов
        number_correct_answers: 1, // Количество правильных ответов
        complete_time: new Date().toISOString(), // Время завершения теста
        accuracy: this.score, // Точность
      };
      this.saveTestResultToLocalStorage(testResult.test, testResult);
      await sendTestResult(testResult)
      this.$router.push("/menu");

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
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #555;
}

.game-over-screen button {
  font-size: 1.2rem;
  padding: 10px 20px;
  margin: 10px;
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

.btn-primary {
  background-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>