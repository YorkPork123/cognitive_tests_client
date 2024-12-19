<script>
import Game from './Game.vue';
import Result from './Result.vue';

export default {
  components: {
    Result,
    Game,
  },
  data() {
    return {
      showResult: false,
      score: 0,
    };
  },
  methods: {
    handleFinish(score) {
      this.score = score;
      this.showResult = true;
    },
    restartGame() {
      this.showResult = false;
      this.score = 0;
    },
  },
};
</script>

<template>
  <div id="app" class="app-container">
    <Game v-if="!showResult" @finish="handleFinish" />
    <Result v-else :score="score" @restart="restartGame" />
  </div>
</template>

<style>
.app-container {
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 200vh;
  background: #f0f4f7;
}
</style>
