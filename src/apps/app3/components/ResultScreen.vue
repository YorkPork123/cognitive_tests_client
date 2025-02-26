<template>
  <div class="result-screen">
    <h1>Ваше время реакции: {{ time }} мс</h1>

    <button @click="restart">Попробовать снова</button>
    <!-- <button v-if="isExamMode" class="btn btn-primary" @click="goToNextTest">Далее</button> -->
    <button class="btn btn-primary" @click="goToMenu">Вернуться в меню</button>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных


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
    isExamMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    accuracy() {
      // Пример вычисления точности (замените на вашу логику)
      return Math.max(0, 100 - this.time / 10).toFixed(2);
    },
  },
  methods: {
    saveTestResultToLocalStorage(testId, result) {
      const key = `test_${testId}`;
      localStorage.setItem(key, JSON.stringify(result));
    },
    restart() {
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
    //     number_all_answers: "1", // Общее количество ответов (для теста на реакцию это 1)
    //     number_correct_answers: "1", // Количество правильных ответов (для теста на реакцию это 1)
    //     complete_time: new Date().toISOString(), // Время завершения теста
    //     accuracy: this.time, // Точность
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
        number_all_answers: "1", // Общее количество ответов (для теста на реакцию это 1)
        number_correct_answers: "1", // Количество правильных ответов (для теста на реакцию это 1)
        complete_time: new Date().toISOString(), // Время завершения теста
        accuracy: this.time, // Точность
      };
      this.saveTestResultToLocalStorage(testResult.test, testResult);
      await sendTestResult(testResult)
      this.$router.push("/menu");
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

.btn-primary {
  background-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>