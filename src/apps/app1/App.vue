<template>
  <div id="app">
    <MunsterbergTest />
  </div>
</template>

<script>
import MunsterbergTest from './components/MunsterbergTest.vue';

export default {
  name: 'App',
  components: {
    MunsterbergTest
  }
}
</script>

<style>
/* Глобальные стили если нужны */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
