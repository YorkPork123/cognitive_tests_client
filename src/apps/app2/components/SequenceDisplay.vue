
<template>
    <div class="sequence-display">
      <span
        v-for="(digit, index) in sequence"
        :key="index"
        :style="{ opacity: opacityLevel }"
        class="digit"
      >
        {{ digit }}
      </span>
    </div>
  </template>

  <script>
  export default {
    props: {
      sequence: {
        type: Array,
        required: true,
      },
      opacityLevel: {
        type: Number,
        required: true,
      },
    },
  };
  </script>

  <style scoped>
  .sequence-display {
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .digit {
    margin: 0 10px;
    transition: opacity 0.3s ease-in-out;
  }
  </style>
