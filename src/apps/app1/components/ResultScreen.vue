<template>
  <div class="text-center">
    <h2>Результаты</h2>
    <p>Угаданные слова: {{ guessedWords.length }} / {{ wordsToFind.length }}</p>
    <p>Уровень внимания: <strong>{{ attentionLevel }}</strong></p>
    <button class="btn btn-primary" @click="$emit('restart-test')">Попробовать снова</button>
    <button class="btn btn-primary" @click="goToNextTest">Далее</button>
  </div>
</template>

<script>
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
      // Формируем ключ для localStorage
      const key = `test_${testId}`;

      // Сохраняем результат в localStorage
      localStorage.setItem(key, JSON.stringify(result));
    },
    goToNextTest() {
      // Формируем результат теста
      const testResult = {
        id: Date.now(),  // Уникальный ID (можно заменить на другой способ генерации)
        test: 1,  // Идентификатор теста
        user: parseInt(localStorage.getItem('user_id')),  // Идентификатор пользователя
        try_number: 1,  // Номер попытки
        number_all_answers: this.wordsToFind.length.toString(),  // Общее количество ответов
        number_correct_answers: this.guessedWords.length.toString(),  // Количество правильных ответов
        complete_time: new Date(Date.now()).toISOString(),  // Время завершения теста
        accuracy: this.attentionLevel,  // Точность
      };

      // Сохраняем результат в localStorage
      this.saveTestResultToLocalStorage(testResult.test, testResult);

      // Переход на страницу следующего теста (app2)
      this.$router.push('/app2');
    },
  },
};
</script>