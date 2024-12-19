<template>
    <div id="app">
      <Instructions v-if="!gameStarted" @startGame="gameStarted = true" />
      <Game v-else @endGame="gameStarted = false" />
    </div>
  </template>

  <script>
  import Instructions from "./components/Instructions.vue";
  import Game from "./components/Game.vue";

  export default {
    data() {
      return {
        gameStarted: false,
      };
    },
    components: {
      Instructions,
      Game,
    },
  };
  </script>

  <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  #app {
    text-align: center;
  }
  </style>
