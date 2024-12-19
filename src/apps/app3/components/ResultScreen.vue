
<template>
    <div class="result-screen">
      <h1>Ваше время реакции: {{ time }} мс</h1>
      <button @click="restart">Попробовать снова</button>
    </div>
  </template>

  <script>
  export default {
    props: {
      time: {
        type: Number,
        required: true,
      },
    },
    methods: {
      restart() {
        this.$emit('restart');
      },
    },
  };
  </script>

  <style scoped>
  .result-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #2ecc71;
    color: white;
    font-size: 24px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 18px;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #16a085;
  }
  </style>
