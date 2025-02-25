<template>
    <div>
      <h2>Вход</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="username">Имя пользователя:</label>
          <input type="text" id="username" v-model="userData.username" required>
        </div>
        <div>
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="userData.password" required>
        </div>
        <button type="submit">Войти</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>

  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        userData: {
          username: '',
          password: '',
        },
        error: '',
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await axios.post('http://localhost:8000/api/login/', this.userData);
          alert('Вход выполнен успешно!');
          localStorage.setItem('user_id', response.data.user_id)
          this.$router.push('/');  // Перенаправление на главную страницу
        } catch (error) {
          this.error = error.response.data.error || 'Ошибка при входе';
        }
      },
    },
  };
  </script>