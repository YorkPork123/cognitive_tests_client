
<template>
  <div id="app">
    <StartScreen v-if="stage === 'start'" @start="startTest" />
    <ReactionTest v-if="stage === 'test'" @finish="finishTest" />
    <ResultScreen v-if="stage === 'result'" :time="reactionTime" @restart="restartTest" />
    <AboutSection />
  </div>
</template>

<script>
import StartScreen from './components/StartScreen.vue';
import ReactionTest from './components/ReactionTest.vue';
import ResultScreen from './components/ResultScreen.vue';
import AboutSection from './components/AboutSection.vue';

export default {
  components: {
    StartScreen,
    ReactionTest,
    ResultScreen,
    AboutSection,
  },
  data() {
    return {
      stage: 'start',
      reactionTime: null,
    };
  },
  methods: {
    startTest() {
      this.stage = 'test';
    },
    finishTest(time) {
      this.reactionTime = time;
      this.stage = 'result';
    },
    restartTest() {
      this.stage = 'start';
      this.reactionTime = null;
    },
  },
};
</script>

<style scoped>
 #app {
    font-family: "Arial", sans-serif;
    text-align: center;
    color: #333;
    background-color: #eef1f5;
    height: 100vh;
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

@media (max-width: 600px) {
  h1 {
    font-size: 14px; 
    margin-left: 0.5rem;
  }
}
</style>
