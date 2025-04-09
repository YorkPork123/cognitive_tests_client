<template>
  <div class="container">
    <h1>Измерение скорости печати</h1>
    <div class="input-area">
      <textarea ref="textInput" v-model="typedText" @input="handleInput" @focus="handleFocus" :style="inputStyle" />
      <div id="typing-area" ref="typingArea" :style="textAreaStyle">
        <span v-for="(char, index) in textToType" :key="index" :style="getCharStyle(index)">
          {{ char }}
        </span>
      </div>
    </div>
    <div v-if="showResult" class="result">
      <h2>Ваша скорость печати: {{ wpm }} символов в минуту</h2>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <button @click="reset" class="reset-button">Сбросить</button>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

export default {
  data() {
    return {
      textToType: "Медуз, гидр и кораллы относят к группе кишечнополостных животных. Эти животные многоклеточные. Тело кишечнополостных животных похоже на мешок, который называют кишечной полостью. В него попадает пища, отсюда и название. Животных с таким строением называют кишечнополостными.",
      typedText: '',
      startTime: null,
      endTime: null,
      correctChars: 0,
      wpm: 0,
      showResult: false,
      error: null,
      currentCharIndex: 0,
    };
  },
  computed: {
    inputStyle() {
      return {
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: 'monospace',
        marginBottom: '10px',
        minHeight: '30px',
        maxHeight: '200px',
        resize: 'vertical', // Разрешить изменение размера по вертикали
      };
    },
    textAreaStyle() {
      return {
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '16px',
        lineHeight: '1.5',
        overflowY: 'auto',
        maxHeight: '200px',
      };
    },
  },
  methods: {
    getCharStyle(index) {
      if (index < this.typedText.length) {
        if (this.typedText[index] === this.textToType[index]) {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      } else {
        return { color: 'gray' };
      }
    },
    handleInput() {
      if (!this.startTime) {
        this.startTime = new Date();
      }

      this.correctChars = 0;
      let correct = true;
      for (let i = 0; i < this.typedText.length; i++) {
        if (this.typedText[i] === this.textToType[i]) {
          this.correctChars++;
        } else {
          correct = false;
          this.error = 'Ошибка! Исправьте опечатку.';
          break;
        }
      }
      if (correct && this.typedText.length > 0 && this.typedText.length <= this.textToType.length) {
        this.error = null;
      }
      if (this.typedText === this.textToType && !this.showResult) {
        this.checkCompletion();
      }
    },
    async checkCompletion() {
      this.endTime = new Date();
      const timeTaken = (this.endTime - this.startTime) / 60000;
      this.wpm = Math.round(this.correctChars / timeTaken);
      this.showResult = true;

      // Формируем результат теста
      const testResult = {
        id: Date.now(), // Уникальный ID
        test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
        user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
        try_number: 1, // Номер попытки
        number_all_answers: this.textToType.length, // Общее количество символов
        number_correct_answers: this.correctChars, // Количество правильных символов
        complete_time: new Date().toISOString(), // Время завершения теста
        accuracy: this.wpm, // Точность в процентах
      };

      // Сохраняем результат в localStorage
      localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

      // Отправляем результат на сервер
      try {
        await sendTestResult(testResult);
        alert(
          `Тест завершен!\nВаша скорость печати: ${this.wpm} символов в минуту\nТочность: ${testResult.accuracy}%`
        );
        this.$router.push('/menu'); // Возвращаемся в меню
      } catch (error) {
        console.error('Ошибка при отправке результата:', error);
        alert('Произошла ошибка при отправке результата. Попробуйте снова.');
      }
    },
    reset() {
      this.typedText = '';
      this.startTime = null;
      this.endTime = null;
      this.correctChars = 0;
      this.wpm = 0;
      this.showResult = false;
      this.error = null;
      this.currentCharIndex = 0;
      this.$refs.textInput.focus();
    },
    handleFocus() {
      this.$refs.textInput.focus();
    },
  },
  mounted() {
    this.$refs.textInput.focus();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.result {
  margin-top: 5px;
  color: green;
}

.error {
  margin-top: 5px;
  color: red;
}

.reset-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 768px) {
  .container {
    max-width: 90%;
  }

  h1 {
    font-size: 24px;
  }

  textarea {
    font-size: 16px;
  }

  .reset-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  h1 {
    margin-top: 20px;
    font-size: 20px;
  }

  textarea {
    font-size: 14px;
  }

  .reset-button {
    padding: 6px 12px;
    margin-bottom: 20px;
  }
}
</style>

