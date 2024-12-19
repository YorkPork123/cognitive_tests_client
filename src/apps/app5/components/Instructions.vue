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
  </div>
</template>

<script>
export default {
  name: "Instructions",
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
}
</style>
