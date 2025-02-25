<template>
    <div class="register-container">
      <h2>Регистрация</h2>
      <div class="form-wrapper">
        <form @submit.prevent="submitForm" class="register-form">
          <!-- Основные поля -->
          <div class="form-group">
            <label for="username">Имя пользователя:</label>
            <input type="text" id="username" v-model="userData.username" required>
          </div>
          <div class="form-group">
            <label for="password">Пароль:</label>
            <input type="password" id="password" v-model="userData.password" required>
          </div>

          <!-- Дополнительные поля -->
          <div class="form-group">
            <label for="age">Возраст:</label>
            <input type="number" id="age" v-model="userData.age">
          </div>
          <div class="form-group">
            <label for="education">Образование:</label>
            <input type="text" id="education" v-model="userData.education">
          </div>
          <div class="form-group">
            <label for="speciality">Специальность:</label>
            <input type="text" id="speciality" v-model="userData.speciality">
          </div>
          <div class="form-group">
            <label for="residence">Место жительства:</label>
            <input type="text" id="residence" v-model="userData.residence">
          </div>
          <div class="form-group">
            <label for="height">Рост (см):</label>
            <input type="number" id="height" v-model="userData.height">
          </div>
          <div class="form-group">
            <label for="weight">Вес (кг):</label>
            <input type="number" id="weight" v-model="userData.weight">
          </div>
          <div class="form-group">
            <label for="lead_hand">Ведущая рука:</label>
            <select id="lead_hand" v-model="userData.lead_hand">
              <option value="left">Левая</option>
              <option value="right">Правая</option>
              <option value="ambidextrous">Амбидекстр</option>
            </select>
          </div>
          <div class="form-group">
            <label for="diseases">Заболевания:</label>
            <input type="text" id="diseases" v-model="userData.diseases">
          </div>
          <div class="form-group">
            <label for="smoking">Курение:</label>
            <select id="smoking" v-model="userData.smoking">
              <option :value="true">Да</option>
              <option :value="false">Нет</option>
            </select>
          </div>
          <div class="form-group">
            <label for="alcohol">Употребление алкоголя:</label>
            <input type="text" id="alcohol" v-model="userData.alcohol">
          </div>
          <div class="form-group">
            <label for="sport">Занятия спортом:</label>
            <input type="text" id="sport" v-model="userData.sport">
          </div>
          <div class="form-group">
            <label for="insomnia">Бессонница:</label>
            <select id="insomnia" v-model="userData.insomnia">
              <option :value="true">Да</option>
              <option :value="false">Нет</option>
            </select>
          </div>
          <div class="form-group">
            <label for="current_health">Текущее состояние здоровья (1-10):</label>
            <input type="number" id="current_health" v-model="userData.current_health" min="1" max="10">
          </div>
          <div class="form-group">
            <label for="gaming">Играете в игры:</label>
            <select id="gaming" v-model="userData.gaming" required="true">
              <option :value="true">Да</option>
              <option :value="false">Нет</option>
            </select>
          </div>

          <button type="submit" class="submit-button">Зарегистрироваться</button>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
  </template>

  <script>
  import { registerUser } from '@/services/api';

  export default {
    data() {
      return {
        userData: {
          username: '',
          password: '',
          age: null,
          education: '',
          speciality: '',
          residence: '',
          height: null,
          weight: null,
          lead_hand: '',
          diseases: '',
          smoking: false,
          alcohol: '',
          sport: '',
          insomnia: false,
          current_health: null,
          gaming: false,
        },
        error: '',
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await registerUser(this.userData);
          alert('Регистрация прошла успешно!');
          this.$router.push('/login');  // Перенаправление на страницу входа
        } catch (error) {
          this.error = error.response?.data?.error || 'Ошибка при регистрации';
        }
      },
    },
  };
  </script>

  <style scoped>
  .register-container {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    height: 100vh; /* Занимает всю высоту экрана */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .form-wrapper {
    width: 100%;
    max-height: 80vh; /* Ограничение высоты формы */
    overflow-y: auto; /* Добавляем прокрутку */
    padding: 1rem;
  }

  .register-form {
    background: #f9f9f9;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-button:hover {
    background-color: #369f6e;
  }

  .error-message {
    color: red;
    margin-top: 1rem;
    text-align: center;
  }
  </style>