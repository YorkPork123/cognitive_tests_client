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
      const gridSize = 2000;
      const rowLength = 50;
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

      let gridArray = Array(gridSize).fill(null);

      const placeWord = (word) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
          attempts++;
          
          const isHorizontal = Math.random() < 0.8;
          
          if (isHorizontal) {
            const rowStartIndex = Math.floor(Math.random() * (gridSize / rowLength)) * rowLength;
            const startIndex = rowStartIndex + Math.floor(Math.random() * (rowLength - word.length));
            
            if (startIndex + word.length <= rowStartIndex + rowLength) {
              const canPlace = gridArray
                .slice(startIndex, startIndex + word.length)
                .every(char => char === null);
                
              if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                  gridArray[startIndex + i] = word[i];
                }
                placed = true;
              }
            }
          } else {
            const startCol = Math.floor(Math.random() * rowLength);
            const startRow = Math.floor(Math.random() * ((gridSize / rowLength) - word.length));
            const startIndex = startRow * rowLength + startCol;
            
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
              const index = startIndex + i * rowLength;
              if (index >= gridSize || gridArray[index] !== null) {
                canPlace = false;
                break;
              }
            }
            
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                const index = startIndex + i * rowLength;
                gridArray[index] = word[i];
              }
              placed = true;
            }
          }
        }
      };

      this.wordsToFind.forEach(placeWord);

      for (let i = 0; i < gridArray.length; i++) {
        if (gridArray[i] === null) {
          gridArray[i] = letters[Math.floor(Math.random() * letters.length)];
        }
      }

      this.letterGrid = gridArray
        .join('')
        .match(new RegExp(`.{1,${rowLength}}`, 'g'))
        .join('\n');
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.handleTestFinish(this.guessedWords);
        }
      }, 1000);
    }
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
