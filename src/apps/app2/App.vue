
<template>
    <div id="app">
      <StartScreen v-if="!isGameStarted && !isGameOver" @start="startGame" />
      <GameField
        v-else-if="isGameStarted"
        @game-over="endGame"
      />
      <GameOverScreen
        v-else
        :score="finalScore"
        @restart="restartGame"
      />
    </div>
  </template>

  <script>
  import StartScreen from "./components/StartScreen.vue";
  import GameField from "./components/GameField.vue";
  import GameOverScreen from "./components/GameOverScreen.vue";

  export default {
    components: {
      StartScreen,
      GameField,
      GameOverScreen,
    },
    data() {
      return {
        isGameStarted: false,
        isGameOver: false,
        finalScore: 0,
      };
    },
    methods: {
      startGame() {
        this.isGameStarted = true;
        this.isGameOver = false;
      },
      endGame(score) {
        this.isGameStarted = false;
        this.isGameOver = true;
        this.finalScore = score;
      },
      restartGame() {
        this.isGameStarted = false;
        this.isGameOver = false;
      },
    },
  };
  </script>

  <style>
  #app {
    font-family: "Arial", sans-serif;
    text-align: center;
    color: #333;
    background-color: #eef1f5;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
