
<template>
    <div class="game-over-screen">
      <h1>Игра окончена!</h1>
      <p>Ваш счёт: {{ score }}</p>
      <button @click="restartGame">Играть снова</button>
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
    emits: ["restart"],
    methods: {
      restartGame() {
        this.$emit("restart");
      },
    },
  };
  </script>

  <style scoped>
  .game-over-screen {
    text-align: center;
    padding: 20px;
  }

  .game-over-screen h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #333;
  }

  .game-over-screen p {
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: #555;
  }

  .game-over-screen button {
    font-size: 1.2rem;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .game-over-screen button:hover {
    background-color: #45a049;
  }
  </style>
