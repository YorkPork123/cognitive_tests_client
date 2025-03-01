<template>
    <div class="wrapper">
      <StroopTest />
    </div>
  </template>

  <script>
  import StroopTest from './components/Test8shadows.vue';

  export default {
    components: {
      StroopTest,
    },
  };
  </script>

  <style>
  .wrapper {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .back-button {
    display: inline-block;
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #5092dd;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
  }

  .back-button:hover {
    background-color: #407bbd;
  }
  </style>