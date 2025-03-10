
<template>
    <div class="start-screen" @click="startTest">
      <h1>Нажмите на любое место, чтобы начать</h1>
    </div>
  </template>

  <script>
  export default {
    methods: {
      startTest() {
        this.$emit('start');
      },
    },
  };
  </script>

  <style scoped>
  .start-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #3498db;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }

  @media (max-width: 600px) {
  h1 {
    font-size: 14px; 
    margin-left: 1rem;
    margin-right: 0.5rem;
  }
}
  </style>
