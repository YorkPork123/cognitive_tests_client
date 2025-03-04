<template>
  <div class="container">
    <h1>Тест Струпа на оттенки</h1>
    <div v-if="isTimerActive">
      <h2>Оставшееся время: {{ remainingTime }} секунд</h2>
    </div>
    <h3>Правильные ответы: {{ right }}</h3>
    <h3>Неправильные ответы: {{ wrong }}</h3>
    <h1>Найдите куб такого же цвета в массиве</h1>
    <div class="color-test">
      <div class="color-container">
        <div class="target-color" :style="{ backgroundColor: targetColor }"></div>
      </div>
      <h1>Массив:</h1>
      <div class="options-row">
        <div
          v-for="(color, index) in options"
          :key="index"
          class="color-option"
          :style="{ backgroundColor: color }"
          @click="checkAnswer(color)"
        ></div>
      </div>
      <h2 v-if="resultMessage">{{ resultMessage }}</h2>
    </div>
  </div>
</template>

  <script>
  import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

  export default {
    mounted() {
      this.showAlert();
      this.generateColors();
    },
    data() {
      return {
        colors: {
          red: ['#ff0f00', '#b20a00', '#c13839', '#742122', '#ff474a', '#780712', '#c76b74', '#9e000f', '#f71b31', '#ff4557', '#de1245'],
          blue: ['#0818A8', '#4682B4', '#87CEEB', '#0F52BA', '#4169E1', '#12aede', '#4ac7ed', '#13647d', '#0871c2', '#1895f5'],
          green: ['#7CFC00', '#3CB371', '#6B8E23', '#32CD32', '#00FF00', '#18f599', '#00bf70', '#00824c', '#13754c', '#13752f', '#227513', '#227513', '#707513'],
          yellow: ['#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC', '#e4e89e', '#fff714', '#e6de00', '#e6cb00'],
          purple: ['#DDA0DD', '#9370DB', '#BA55D3', '#800080', '#4B0082', '#91068f', '#91068f', '#ab3fa9', '#c25dc0', '#ac5dc2', '#a318c9', '#b602e8'],
        },
        targetColor: '',
        options: [],
        right: 0,
        wrong: 0,
        resultMessage: '',
        isTimerActive: false,
        remainingTime: 60,
        timerInterval: null,
      };
    },
    beforeUnmount() {
      clearInterval(this.timerInterval);
    },
    methods: {
      showAlert() {
        alert(
          'Тест 8\n Вам будет дано 60 секунд. \n За это время ваша задача найти квадрат в массиве, такого же цвета как в задании'
        );
        this.startTimer();
      },
      startTimer() {
        this.isTimerActive = true;
        this.remainingTime = 10;

        this.timerInterval = setInterval(() => {
          this.remainingTime--;
          if (this.remainingTime <= 0) {
            clearInterval(this.timerInterval);
            this.isTimerActive = false;
            this.finishTest(); // Завершаем тест
          }
        }, 1000);
      },
      async finishTest() {
        // Формируем результат теста
        const testResult = {
          id: Date.now(), // Уникальный ID
          test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
          user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
          try_number: 1, // Номер попытки
          number_all_answers: this.right + this.wrong, // Общее количество ответов
          number_correct_answers: this.right, // Количество правильных ответов
          complete_time: new Date().toISOString(), // Время завершения теста
          accuracy: (this.right / (this.right + this.wrong) * 100).toFixed(0), // Точность в процентах
        };

        // Сохраняем результат в localStorage
        localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

        // Отправляем результат на сервер
        try {
          await sendTestResult(testResult);
          alert(
            `Тест завершен!\nПравильных ответов: ${this.right}\nНеправильных ответов: ${this.wrong}\nТочность: ${testResult.accuracy}%`
          );
          this.$router.push('/menu'); // Возвращаемся в меню
        } catch (error) {
          console.error('Ошибка при отправке результата:', error);
          alert('Произошла ошибка при отправке результата. Попробуйте снова.');
        }
      },
      generateColors() {
        this.resultMessage = '';
        const colorKeys = Object.keys(this.colors);
        const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        this.targetColor = this.colors[randomColorKey][Math.floor(Math.random() * this.colors[randomColorKey].length)];

        const allColors = Object.values(this.colors).flat();
        this.options = this.getRandomColors(allColors, this.targetColor, 12);
      },
      getRandomColors(allColors, targetColor, count) {
        const colors = new Set();
        colors.add(targetColor); // Гарантируем, что целевой цвет есть в массиве

        while (colors.size < count) {
          const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
          colors.add(randomColor);
        }

        return Array.from(colors).sort(() => Math.random() - 0.5); // Перемешиваем массив
      },
      checkAnswer(selectedColor) {
        if (this.isSimilarColor(selectedColor, this.targetColor)) {
          this.right++;
          this.generateColors(); // Генерируем новые цвета
        } else {
          this.resultMessage = 'Вы выбрали неверный куб. Попробуйте снова.';
          this.wrong++;
        }
      },
      isSimilarColor(color1, color2) {
        return color1 === color2;
      },
    },
  };
  </script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.color-test {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.color-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.target-color {
  width: 100px;
  height: 100px;
  border: 2px solid #000;
}

.options-row {
  display: flex;
  flex-wrap: wrap; /* Позволяет элементам переноситься на новую строку */
  justify-content: center;
  gap: 5px; 
  padding: 10px;
  width: 100%; 
}

.color-option {
  width: 50px; 
  height: 50px; 
  cursor: pointer;
  border: 1px solid #000;
}

/* Адаптация для мобильных устройств */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 16px;
  }

  h3 {
    font-size: 14px;
  }

  .target-color {
    width: 100px;
    height: 100px;
  }

  .options-row {
    flex-direction: column; /* Элементы в столбик на мобильных */
    align-items: center; /* Центрируем элементы */
    gap: 5px; /* Уменьшаем отступы */
  }

  .color-option {
    width: 80px;
    height: 80px;
  }
}
</style>