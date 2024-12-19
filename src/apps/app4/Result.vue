<template>
    <div class="result-container">
      <h2>Игра окончена!</h2>
      <p>Ваш возраст мозга: {{ score }} лет</p>
      <button @click="$emit('restart')">Играть снова</button>
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
  };
  </script>

  <style>
  .result-container {
    text-align: center;
    padding: 20px;
  }
  </style>
