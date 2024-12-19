<template>
    <div class="text-center">
      <h2>Результаты</h2>
      <p>Угаданные слова: {{ guessedWords.length }} / {{ wordsToFind.length }}</p>
      <p>Уровень внимания: <strong>{{ attentionLevel }}</strong></p>
      <button class="btn btn-primary" @click="$emit('restart-test')">Попробовать снова</button>
    </div>
  </template>

  <script>
  export default {
    props: ['guessedWords', 'wordsToFind'],
    computed: {
      attentionLevel() {
        const guessedCount = this.guessedWords.length;
        if (guessedCount < 10) return 'Низкий';
        if (guessedCount < 15) return 'Удовлетворительный';
        if (guessedCount < 20) return 'Средний';
        if (guessedCount < 25) return 'Повышенный';
        return 'Высокий';
      }
    }
  };
  </script>
