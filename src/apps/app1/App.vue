<template>
  <div id="app">
    <div class="container mt-5">
      <StartScreen v-if="screen === 'start'" @start-test="startTest" />
      <TestScreen v-if="screen === 'test'" :letter-grid="letterGrid" :time-left="timeLeft" @finish-test="finishTest"
        @update-input="updateInput" />
      <ResultScreen v-if="screen === 'result'" :guessed-words="guessedWords" :words-to-find="wordsToFind"
        @restart-test="restartTest" />
    </div>
  </div>
</template>

<script>
import StartScreen from './components/StartScreen.vue';
import TestScreen from './components/TestScreen.vue';
import ResultScreen from './components/ResultScreen.vue';

export default {
  components: { StartScreen, TestScreen, ResultScreen },
  data() {
    return {
      screen: 'start',
      letterGrid: '',
      wordsToFind: [
        'мир', 'солнце', 'луна', 'вода', 'лес', 'река', 'город', 'день',
        'ночь', 'зима', 'лето', 'осень', 'весна', 'книга', 'дом', 'кот',
        'пёс', 'птица', 'цветок', 'зверь', 'трава', 'земля', 'камень',
        'дорога', 'звезда', 'дерево', 'облако', 'море', 'гора', 'ветер',
      ], // Слова для поиска
      userInput: '', // Ввод пользователя
      guessedWords: [], // Угаданные слова
      timeLeft: 120, // Таймер в секундах
      timer: null // Ссылка на таймер
    };
  },
  methods: {
    startTest() {
      this.screen = 'test';
      this.generateLetterGrid();
      this.startTimer();
    },
    finishTest() {
      clearInterval(this.timer);
      this.evaluateResults();
      this.screen = 'result';
    },
    restartTest() {
      this.screen = 'start';
      this.userInput = '';
      this.guessedWords = [];
      this.timeLeft = 120;
      clearInterval(this.timer);
    },
    generateLetterGrid() {
      const gridSize = 1000; // Общее количество символов
      const rowLength = 50; // Количество символов в строке для переноса
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'; // Русский алфавит

      // Изначально заполняем сетку случайными буквами
      let gridArray = Array(gridSize).fill(null);

      // Функция для вставки слова в сетку
      const placeWordHorizontally = (word) => {
        let placed = false;

        while (!placed) {
          // Случайная стартовая позиция для слова
          const rowStartIndex = Math.floor(Math.random() * (gridSize / rowLength)) * rowLength;
          const startIndex = rowStartIndex + Math.floor(Math.random() * (rowLength - word.length));

          // Проверка на то, что слово полностью помещается в строке и не пересекается с другими словами
          const canPlace = gridArray
            .slice(startIndex, startIndex + word.length)
            .every((char) => char === null || char === word[char.indexOf]);

          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              gridArray[startIndex + i] = word[i];
            }
            placed = true;
          }
        }
      };

      // Вставка всех слов
      this.wordsToFind.forEach(placeWordHorizontally);

      // Заполнение оставшихся пустых мест случайными буквами
      gridArray = gridArray.map((char) =>
        char === null ? letters[Math.floor(Math.random() * letters.length)] : char
      );

      // переносы строк каждые rowLength символов (чтобы было читаемо)
      this.letterGrid = gridArray
        .join('')
        .match(new RegExp(`.{1,${rowLength}}`, 'g'))
        .join('\n');
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.finishTest();
        }
      }, 1000);
    },
    evaluateResults() {
      const userWords = this.userInput
        .toLowerCase()
        .split(',')
        .map(word => word.trim());
      this.guessedWords = this.wordsToFind.filter(word => userWords.includes(word));
    },
    updateInput(input) {
      this.userInput = input;
    }
  }
};
</script>

<style scoped>
#app {
  font-family: "Arial", sans-serif;
  text-align: center;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>