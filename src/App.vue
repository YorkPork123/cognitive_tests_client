
<template>
  <div id="parent-app">
    <h1>Мозговые тесты</h1>
    <nav>
      <router-link to="/app1">Мюнстерберг</router-link>
      <router-link to="/app2">N2 прошлых</router-link>
      <router-link to="/app3">Скорость клика</router-link>
      <router-link to="/app4">Возраст мозга (круги)</router-link>
      <router-link to="/app5">Мозговой тренажер</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ParentApp'
};
</script>

<style>
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
}
</style>
