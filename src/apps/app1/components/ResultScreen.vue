<template>
  <div class="text-center">
    <h2>Результаты</h2>
    <p>Угаданные слова: {{ guessedWords.length }} / {{ wordsToFind.length }}</p>
    <p>Уровень внимания: <strong>{{ attentionLevel }}</strong></p>
    <button class="btn btn-primary" @click="$emit('restart-test')">Попробовать снова</button>
    <button class="btn btn-primary" @click="goToMenu">Вернуться в меню</button>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

export default {
  props: {
    guessedWords: {
      type: Array,
      required: true,
    },
    wordsToFind: {
      type: Array,
      required: true,
    },
    testId: {
      type: Number,
      required: true,
    },
    isExamMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    attentionLevel() {
      const guessedCount = this.guessedWords.length;
      if (guessedCount < 10) return 'Низкий';
      if (guessedCount < 15) return 'Удовлетворительный';
      if (guessedCount < 20) return 'Средний';
      if (guessedCount < 25) return 'Повышенный';
      return 'Высокий';
    },
  },
  methods: {
    saveTestResultToLocalStorage(testId, result) {
      const key = `test_${testId}`;
      localStorage.setItem(key, JSON.stringify(result));
    },
    // isExamMode() {
    //   if (parseInt(localStorage.getItem('isExameMode') == 1)) {
    //     this.isExamMode = true
    //   }
    // },
    // goToNextTest() {
    //   // Сохраняем результат текущего теста
    //   const testResult = {
    //     id: Date.now(),
    //     test: parseInt(localStorage.getItem('test_id')),
    //     user: parseInt(localStorage.getItem('user_id')),
    //     try_number: 1,
    //     number_all_answers: this.wordsToFind.length.toString(),
    //     number_correct_answers: this.guessedWords.length.toString(),
    //     complete_time: new Date().toISOString(),
    //     accuracy: this.attentionLevel,
    //   };
    //   this.saveTestResultToLocalStorage(testResult.test, testResult);
    //   // this.isExamMode

    //   // Определяем следующий тест
    //   const nextTestId = parseInt(localStorage.getItem('test_id')) + 1;
    //   localStorage.setItem('test_id', nextTestId);
    //   if (nextTestId <= 5) {
    //     this.$router.push(`/app${nextTestId}`);
    //   } else {
    //     // Если тесты закончились, возвращаемся в меню
    //     this.$router.push('/menu');
    //   }
    // },
    async goToMenu() {
      // Сохраняем результат текущего теста
      const testResult = {
        id: Date.now(),
        test: parseInt(localStorage.getItem('test_id')),
        user: parseInt(localStorage.getItem('user_id')),
        try_number: 1,
        number_all_answers: this.wordsToFind.length.toString(),
        number_correct_answers: this.guessedWords.length.toString(),
        complete_time: new Date().toISOString(),
        accuracy: this.attentionLevel,
      };
      this.saveTestResultToLocalStorage(testResult.test, testResult);
      await sendTestResult(testResult)
      this.$router.push('/menu');
    },
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
  padding: 20px;
}

.btn {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>