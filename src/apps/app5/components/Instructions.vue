<template>
  <div class="instructions">
    <h2>Инструкция</h2>
    <p>Удерживайте курсор внутри движущегося круга.</p>
    <p>
      Если текст и его цвет совпадают, кликните на кружочке в течение 3 секунд.
      Иначе игнорируйте. Каждое правильное действие приносит 20 очков. Игра
      длится 1 минуту или до нажатия кнопки "Закончить".
    </p>
    <button @click="$emit('startGame')">Начать</button>
    <button class="exit-button" @click="exitToMenu">Выйти в меню</button>
  </div>
</template>

<script>
export default {
  name: "Instructions",
  methods: {
    exitToMenu() {
      this.$router.push('/menu');
      this.$emit('cancel');
    }
  }
};
</script>

<style>
.instructions {
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  margin-right: 10px;
}
.exit-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #f44336; /* Красный цвет для кнопки выхода */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.exit-button:hover {
  background-color: #d32f2f; /* Темнее красный при наведении */
}
</style>