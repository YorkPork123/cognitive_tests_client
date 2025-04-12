<template>
  <div id="app">
    <div class="container mt-3 mt-md-5">
      <StartScreen 
        v-if="screen === 'start'" 
        @start-test="startTest" 
      />
      <TestScreen 
        v-if="screen === 'test'" 
        :letter-grid="formattedLetterGrid" 
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
      letterGrid: [],
      formattedLetterGrid: '',
      wordsToFind: [
        'мир', 'солнце', 'луна', 'вода', 'лес', 'река', 'город', 'день',
        'ночь', 'зима', 'лето', 'осень', 'весна', 'книга', 'дом', 'кот',
        'пёс', 'птица', 'цветок', 'зверь', 'трава', 'земля', 'камень',
        'дорога', 'звезда', 'дерево', 'облако', 'море', 'гора', 'ветер'
      ],
      guessedWords: [],
      timeLeft: 120,
      timer: null
    };
  },
  methods: {
    startTest() {
      this.screen = 'test';
      this.generateLetterGrid();
      this.startTimer();
    },
    handleTestFinish(selectedWords) {
      clearInterval(this.timer);
      this.guessedWords = selectedWords;
      this.screen = 'result';
    },
    restartTest() {
      this.screen = 'start';
      this.guessedWords = [];
      this.timeLeft = 120;
      clearInterval(this.timer);
    },
    generateLetterGrid() {
      const rows = this.isMobile() ? 30 : 40; // Меньше строк на мобильных
      const cols = this.isMobile() ? 25 : 50; // Уже колонки на мобильных
      const gridSize = rows * cols;
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

      // Создаем двумерный массив для сетки
      let grid = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => null)
      );

      // Функция для проверки возможности размещения слова
      const canPlaceWord = (word, row, col, isHorizontal) => {
        if (isHorizontal) {
          if (col + word.length > cols) return false;
          for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== null) return false;
          }
        } else {
          if (row + word.length > rows) return false;
          for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== null) return false;
          }
        }
        return true;
      };

      // Функция для размещения слова
      const placeWord = (word) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
          attempts++;
          const isHorizontal = Math.random() < 0.8;
          const row = Math.floor(Math.random() * (isHorizontal ? rows : rows - word.length));
          const col = Math.floor(Math.random() * (isHorizontal ? cols - word.length : cols));

          if (canPlaceWord(word, row, col, isHorizontal)) {
            for (let i = 0; i < word.length; i++) {
              if (isHorizontal) {
                grid[row][col + i] = word[i];
              } else {
                grid[row + i][col] = word[i];
              }
            }
            placed = true;
          }
        }
      };

      // Размещаем слова
      this.wordsToFind.forEach(placeWord);

      // Заполняем оставшиеся ячейки случайными буквами
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (grid[row][col] === null) {
            grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
          }
        }
      }

      // Сохраняем исходную сетку и форматированную версию
      this.letterGrid = grid;
      this.formattedLetterGrid = grid.map(row => row.join('')).join('\n');
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.handleTestFinish(this.guessedWords);
        }
      }, 1000);
    },
    isMobile() {
      return window.innerWidth <= 768;
    }
  },
  watch: {
    // Регенерируем сетку при изменении размера окна
    screen(newVal) {
      if (newVal === 'test') {
        this.generateLetterGrid();
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
  padding: 0 10px;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 5px;
  }
}
</style>
