<template>
  <div class="start-screen">
    <h1>Интеллектуальная игра</h1>
    <p>
      Вам будет показана последовательность из трех цифр, которую нужно запомнить.
      <br />
      Через 2 секунды последовательность сдвинется, и нужно ответить:
      совпадают ли первая и третья цифра?
      <br />
      Нажмите стрелку влево или "Нет", если не совпадают. Нажмите стрелку вправо или "Да", если совпадают.
    </p>
    <button @click="startGame">Начать игру</button>
    <!-- Кнопка "Выйти в меню" -->
    <button @click="exitToMenu" class="exit-button">Выйти в меню</button>
  </div>
</template>

<script>
export default {
  emits: ["start"],
  methods: {
    startGame() {
      this.$emit("start");
    },
    // Метод для выхода в меню
    exitToMenu() {
      this.$router.push('/menu');
    },
  },
};
</script>

<style scoped>
.start-screen {
  text-align: center;
  padding: 20px;
}

.start-screen h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.start-screen p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.start-screen button {
  font-size: 1.2rem;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px; /* Отступ между кнопками */
}

.start-screen button:hover {
  background-color: #45a049;
}

.exit-button {
  background-color: #f44336; /* Красный цвет для кнопки выхода */
}

.exit-button:hover {
  background-color: #d32f2f; /* Темнее красный при наведении */
}
</style>