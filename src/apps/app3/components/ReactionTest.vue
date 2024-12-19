
<template>
    <div
      class="reaction-test"
      :style="{ backgroundColor: screenColor }"
      @click="handleClick"
    >
      <h1 v-if="screenColor === 'red'">
        Дождитесь зелёного экрана и кликните, как можно быстрее.
      </h1>
      <h1 v-else-if="screenColor === 'green'">
        Кликайте!
      </h1>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        screenColor: 'red',
        timer: null,
        startTime: null,
      };
    },
    methods: {
      handleClick() {
        if (this.screenColor === 'green') {
          const reactionTime = Date.now() - this.startTime;
          this.$emit('finish', reactionTime);
        } else if (this.screenColor === 'red') {
          clearTimeout(this.timer);
          alert('Вы кликнули слишком рано! Попробуйте снова.');
          this.resetTest();
        }
      },
      startTest() {
        const randomDelay = Math.random() * 2000 + 2000;
        this.timer = setTimeout(() => {
          this.screenColor = 'green';
          this.startTime = Date.now();
        }, randomDelay);
      },
      resetTest() {
        this.screenColor = 'red';
        this.startTest();
      },
    },
    mounted() {
      this.startTest();
    },
    beforeUnmount() {
      clearTimeout(this.timer);
    },
  };
  </script>

  <style scoped>
  .reaction-test {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: white;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  </style>
