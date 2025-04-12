<template>
  <div class="login-container">
    <h2 class="auth-title">Вход</h2>
    <form @submit.prevent="submitForm" class="login-form">
      <div>
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" v-model="userData.username" required>
      </div>
      <div>
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="userData.password" required>
      </div>
      <button type="submit">Войти</button>
      <button type="button" @click="goToRegisterScreen">Зарегистрироваться</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
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
        const response = await axios.post('https://yorkpork123.pythonanywhere.com/api/login/', this.userData);
        alert('Вход выполнен успешно!');
        localStorage.setItem('user_id', response.data.user_id)
        this.$router.push('/');  // Перенаправление на главную страницу
      } catch (error) {
        this.error = error.response.data.error || 'Ошибка при входе';
      }
    },
    goToRegisterScreen() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.login-form {
  width: 100%;
  max-width: 600px;
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-form div {
  margin-bottom: 15px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.login-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-form button {
  width: 80%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.login-form button:hover {
  background-color: #3aa876;
}

.error-message {
  color: red;
  margin-top: 10px;
}

@media (max-width: 600px) {
  .auth-title {
    font-size: 24px !important;
  }
}
</style>
