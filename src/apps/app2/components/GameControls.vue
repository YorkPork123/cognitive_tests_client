<template>
  <div class="game-controls">
    <button @click="answer(false)" class="no-button">Нет</button>
    <button @click="answer(true)" class="yes-button">Да</button>

  </div>
  <!-- Кнопка "Выйти в меню" -->
  <button @click="exitToMenu" class="exit-button">Выйти в меню</button>
</template>

<script>
export default {
  emits: ["answer"],
  methods: {
    answer(isMatch) {
      this.$emit("answer", isMatch);
    },
    // Метод для выхода в меню
    exitToMenu() {
      this.$router.push('/menu');
    },
  },
};
</script>

<style scoped>
.game-controls {
  display: flex;
  gap: 20px;
}

button {
  font-size: 1.2rem;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: transform 0.2s;
}

button:active {
  transform: scale(0.95);
}

.no-button {
  background-color: #ff6b6b;
  color: #fff;
}

.yes-button {
  background-color: #4caf50;
  color: #fff;
}

.exit-button {
  background-color: #f44336; /* Красный цвет для кнопки выхода */
  color: #fff;
}

.exit-button:hover {
  background-color: #d32f2f; /* Темнее красный при наведении */
}
</style>