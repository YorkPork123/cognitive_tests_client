<template>
  <div class="container">
    <h1>Тест Струпа лёгкий</h1>
    <div v-if="!isTestStarted" >
      <h1>Тест Струпа</h1>
      <p>Вам будет дано 60 секунд. </p>
      <p>За это время ваша задача найти все слова, у которых цвет текста соответствует заданному в условии </p>
      <p>Нажмите галочку у цвета </p>
      <button @click="startTest">Начать тест</button>
  </div>
  <div v-else >
    <div v-if="isTimerActive">
      <h2>Оставшееся время: {{ remainingTime }} секунд</h2>
    </div>
    <h3>Правильные ответы: {{ right }}</h3>
    <h3>Неправильные ответы: {{ wrong }}</h3>
    <h1>Выберите все {{ rusrightcolor }} слова</h1>
    <div class="words-grid">
      <div v-for="(word, id) in words" :key="id" class="word-item">
        <span :style="{ color: word.color }">{{ word.word }}</span>
        <input type="checkbox" v-model="selectedWords" :value="word.id" />
      </div>
    </div>
    <div>
      <button v-if="words.length > 0" class="button" @click="checkSelected">Проверка</button>
      <h2 v-if="resultMessage">{{ resultMessage }}</h2>
    </div>
  </div>
</div>
</template>
<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

export default {
data() {
  return {
    colors: [
      { name: 'red', word: 'красные' },
      { name: 'blue', word: 'синие' },
      { name: 'black', word: 'черные' },
      { name: 'purple', word: 'фиолетовые' },
      { name: 'green', word: 'зеленые' },
      { name: 'yellow', word: 'желтые' },
      { name: 'orange', word: 'оранжевые' },
      { name: 'pink', word: 'розовые' },
      { name: 'brown', word: 'коричневые' },
    ],
    allWords: [
      { id: 1, word: 'Коричневый', color: 'black' },
      { id: 2, word: 'Красный', color: 'pink' },
      { id: 3, word: 'Зеленый', color: 'red' },
      { id: 4, word: 'Черный', color: 'blue' },
      { id: 5, word: 'Желтый', color: 'green' },
      { id: 6, word: 'Синий', color: 'blue' },
      { id: 7, word: 'Фиолетовый', color: 'black' },
      { id: 8, word: 'Оранжевый', color: 'orange' },
      { id: 9, word: 'Синий', color: 'purple' },
      { id: 10, word: 'Фиолетовый', color: 'black' },
      { id: 11, word: 'Зеленый', color: 'purple' },
      { id: 12, word: 'Синий', color: 'pink' },
      { id: 13, word: 'Желтый', color: 'black' },
      { id: 14, word: 'Синий', color: 'green' },
      { id: 15, word: 'Фиолетовый', color: 'brown' },
      { id: 16, word: 'Фиолетовый', color: 'orange' },
      { id: 17, word: 'Голубой', color: 'blue' },
      { id: 18, word: 'Черный', color: 'orange' },
      { id: 19, word: 'Коричневый', color: 'purple' },
      { id: 20, word: 'Розовый', color: 'pink' },
      { id: 21, word: 'Синий', color: 'yellow' },
      { id: 22, word: 'Красный', color: 'brown' },
      { id: 23, word: 'Зеленый', color: 'red' },
      { id: 24, word: 'Синий', color: 'blue' },
      { id: 25, word: 'Коричневый', color: 'orange' },
      { id: 26, word: 'Синий', color: 'brown' },
      { id: 27, word: 'Черный', color: 'black' },
      { id: 28, word: 'Оранжевый', color: 'green' },
      { id: 29, word: 'Синий', color: 'green' },
      { id: 30, word: 'Розовый', color: 'pink' },
      { id: 31, word: 'Синий', color: 'pink' },
      { id: 32, word: 'Красный', color: 'yellow' },
      { id: 33, word: 'Зеленый', color: 'yellow' },
      { id: 34, word: 'Синий', color: 'orange' },
      { id: 35, word: 'Коричневый', color: 'orange' },
      { id: 36, word: 'Синий', color: 'purple' },
      { id: 37, word: 'Черный', color: 'purple' },
      { id: 38, word: 'Оранжевый', color: 'red' },
      { id: 39, word: 'Синий', color: 'red' },
    ],
    words: [],
    isTestStarted: false,
    selectedWords: [],
    resultMessage: '',
    rightcolor: '',
    rusrightcolor: '',
    wrong: 0,
    right: 0,
    isTimerActive: false,
    remainingTime: 60,
    timerInterval: null,
  };
},
created() {
 
  
},
beforeUnmount() {
  clearInterval(this.timerInterval);
},
methods: {
  saveTestResultToLocalStorage(testId, result) {
    const key = `test_${testId}`;
    localStorage.setItem(key, JSON.stringify(result));
  },
  isExamMode() {
    if (parseInt(localStorage.getItem('isExameMode') == 1)) {
      this.isExamMode = true
    }
  },
  startTest() {
    this.isTestStarted=true;
    this.startTimer();
    this.nextQuiz();
  },
  startTimer() {
    this.isTimerActive = true;
    this.remainingTime = 60;
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
      test: parseInt(localStorage.getItem("test_id")), // Идентификатор теста
      user: parseInt(localStorage.getItem("user_id")), // Идентификатор пользователя
      try_number: 1, // Номер попытки
      number_all_answers: this.right + this.wrong, // Общее количество ответов (для теста на возраст мозга это 1)
      number_correct_answers: this.right, // Количество правильных ответов (для теста на возраст мозга это 1)
      complete_time: new Date().toISOString(), // Время завершения теста
      accuracy: (this.right / (this.right + this.wrong) * 100).toFixed(0), // Точность
    };
    this.saveTestResultToLocalStorage(testResult.test, testResult);
    alert(
      `Тест завершен!\nПравильных ответов: ${this.right}\nНеправильных ответов: ${this.wrong}\nТочность: ${testResult.accuracy.toFixed(2)}%`
    );
    await sendTestResult(testResult)
    this.$router.push("/menu");
  },
  getWord(colorName) {
    const colorObj = this.colors.find((color) => color.name === colorName);
    return colorObj ? colorObj.word : '';
  },
  checkSelected() {
    const correctAnswers = this.words
      .filter((word) => word.color === this.rightcolor)
      .map((word) => word.id);

    const isCorrect =
      this.selectedWords.length === correctAnswers.length &&
      this.selectedWords.every((id) => correctAnswers.includes(id));

    if (isCorrect) {
      this.right += 1;
      this.nextQuiz();
    } else {
      this.resultMessage = 'Вы выбрали неверные слова. Попробуйте снова.';
      this.wrong += 1;
    }
  },
  nextQuiz() {
    this.selectedWords = [];
    this.resultMessage = '';
    this.rightcolor = '';

    let a = this.shuffleArray(this.allWords);
    this.words = a.slice(0, 8);
    this.rightcolor = this.words[Math.floor(Math.random() * 7)].color;
    this.rusrightcolor = this.getWord(this.rightcolor);
  },
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
},
};
</script>

<style scoped>
.container {
margin: 0 auto;
padding: 10px;
box-sizing: border-box;
flex-direction: column;
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

.words-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 5px;
}

.word-item {
display: flex;
align-items: center;
justify-content: space-between;
font-size: 18px;
margin: 0;
}

.word-item span {
margin: 0;
padding: 0;
flex: 1;
white-space: nowrap;
}

.button {
background-color: #5092dd;
color: white;
border: none;
padding: 15px 20px;
font-size: 18px;
cursor: pointer;
border-radius: 8px;
width: 80%;
margin-top: 10px;
align-items: center;
justify-content: center;
}

input[type='checkbox'] {
transform: scale(1.5);
margin-left: 10px;
}

/* Адаптация для мобильных устройств */
@media (max-width: 600px) {
#app {
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

.words-grid {
  grid-template-columns: 1fr;
}

.word-item {
  font-size: 16px;
  flex-direction: row;
  align-items: center;
}

.word-item span {
  margin-right: 10px;
}

input[type='checkbox'] {
  transform: scale(1.2);
  margin-left: 0;
}

.button {
  padding: 10px;
  font-size: 16px;
}
}
</style>