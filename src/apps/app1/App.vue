<template>
  <div id="app">
    <div class="container mt-5">
      <StartScreen 
        v-if="screen === 'start'" 
        @start-test="startTest" 
      />
      <TestScreen 
        v-if="screen === 'test'" 
        :letter-grid="letterGrid" 
        :time-left="timeLeft" 
        @finish-test="handleTestFinish"
      />
      <ResultScreen 
        v-if="screen === 'result'" 
        :guessed-words="guessedWords" 
        :words-to-find="wordsToFind"
        :test-id="1"
        :is-exam-mode="false"
        @restart-test="restartTest"
      />
    </div>
  </div>
</template>

<script>
import StartScreen from './components/StartScreen.vue';
import TestScreen from './components/TestScreen.vue';
import ResultScreen from './components/ResultScreen.vue';

export default {
  name: 'App',
  components: { StartScreen, TestScreen, ResultScreen },
  data() {
    return {
      screen: 'start',
      letterGrid: '',
      wordsToFind: [
        'мир', 'солнце', 'луна', 'вода', 'лес', 'река', 'город', 'день',
        'ночь', 'зима', 'лето', 'осень', 'весна', 'книга', 'дом', 'кот',
        'пёс', 'птица', 'цветок', 'зверь', 'трава', 'земля', 'камень',
        'дорога', 'звезда', 'дерево', 'облако', 'море', 'гора', 'ветер'
      ],
      guessedWords: [],
      timeLeft: 120,
      timer: null,
      testActive: false
    };
  },
  methods: {
    startTest() {
      this.screen = 'test';
      this.guessedWords = [];
      this.timeLeft = 120;
      this.generateLetterGrid();
      this.startTimer();
      this.testActive = true;
    },
    handleTestFinish(selectedWords) {
      if (!this.testActive) return;
      
      this.testActive = false;
      clearInterval(this.timer);
      this.guessedWords = selectedWords || [];
      this.screen = 'result';
    },
    restartTest() {
      this.screen = 'start';
    },
    generateLetterGrid() {
      const rows = 40;
      const cols = 50;
      const gridSize = rows * cols;
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      let gridArray = Array(gridSize).fill(null);
      let placedWords = [];

      // Функция для размещения слова строго горизонтально
      const placeWordHorizontally = (word) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
          attempts++;
          
          const row = Math.floor(Math.random() * rows);
          const startCol = Math.floor(Math.random() * (cols - word.length));
          const startIndex = row * cols + startCol;
          
          // Проверяем, можно ли разместить слово
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (gridArray[startIndex + i] !== null) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              gridArray[startIndex + i] = word[i];
            }
            placed = true;
            placedWords.push(word);
          }
        }
      };

      // Пытаемся разместить все слова в случайном порядке
      const shuffledWords = [...this.wordsToFind].sort(() => Math.random() - 0.5);
      shuffledWords.forEach(placeWordHorizontally);

      // Если какие-то слова не поместились, пробуем ещё раз
      const missedWords = this.wordsToFind.filter(word => !placedWords.includes(word));
      if (missedWords.length > 0) {
        missedWords.forEach(placeWordHorizontally);
      }

      // Заполняем оставшиеся ячейки случайными буквами
      for (let i = 0; i < gridArray.length; i++) {
        if (gridArray[i] === null) {
          gridArray[i] = letters[Math.floor(Math.random() * letters.length)];
        }
      }

      // Форматируем в строки
      this.letterGrid = [];
      for (let row = 0; row < rows; row++) {
        const start = row * cols;
        const end = start + cols;
        this.letterGrid.push(gridArray.slice(start, end).join(''));
      }
      this.letterGrid = this.letterGrid.join('\n');
      
      // Обновляем wordsToFind только размещенными словами
      this.wordsToFind = placedWords;
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.handleTestFinish(this.guessedWords);
        }
      }, 1000);
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
}
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
