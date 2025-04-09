<template>
  <div class="text-center">
    <h2>Тест Мюнстерберга на внимание</h2>
    <p>После запуска у Вас будет 2 минуты, чтобы найти как можно больше слов в зашифрованном тексте. Нажмите на кнопку, чтобы начать.</p>
    <button class="btn btn-primary" @click="$emit('start-test')">Начать</button>
  </div>
</template>

<script>
export default {
  name: 'StartScreen'
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
}
</style>