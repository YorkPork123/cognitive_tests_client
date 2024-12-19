<template>
    <div class="text-center">
      <h2>Тест Мюнстерберга на внимание</h2>
      <p>После запуска у Вас будет 2 минуты, чтобы найти как можно больше слов в зашифрованном тексте. Нажмите на кнопку, чтобы начать.</p>
      <button class="btn btn-primary" @click="$emit('start-test')">Начать</button>
    </div>
  </template>
