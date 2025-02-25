<template>
    <div class="result-container">
      <h2>Игра окончена!</h2>
      <p>Ваш возраст мозга: {{ score }} лет</p>
      <button @click="$emit('restart')">Играть снова</button>
      <button class="btn btn-primary" @click="goToNextTest">Далее</button>
    </div>
  </template>

  <script>
  export default {
    props: {
      score: {
        type: Number,
        required: true,
      },
    },
    methods: {
      goToNextTest() {
      // Переход на страницу следующего теста (app2)
      this.$router.push('/app5');
      },
    },
  };
  </script>

  <style>
  .result-container {
    text-align: center;
    padding: 20px;
  }
  </style>
