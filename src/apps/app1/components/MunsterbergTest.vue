<template>
  <div class="munsterberg-test">
    <!-- Стартовый экран -->
    <div v-if="screen === 'start'" class="start-screen">
      <h2>Тест Мюнстерберга на внимание</h2>
      <p>После запуска у Вас будет 2 минуты, чтобы найти как можно больше слов в зашифрованном тексте. Нажмите на кнопку, чтобы начать.</p>
      <button class="btn btn-primary" @click="startTest">Начать</button>
    </div>

    <!-- Экран теста -->
    <div v-if="screen === 'test'" class="test-screen">
      <h5 class="text-center mb-3">Выделите найденные слова в тексте ниже</h5>
      
      <div
        class="letter-grid"
        ref="textContainer"
        @mouseup="handleSelection"
        @touchend="handleSelection"
        @touchcancel="cancelSelection"
      >
        <div v-for="(line, lineIndex) in textLines" :key="lineIndex" class="text-line">
          <span
            v-for="(char, charIndex) in line"
            :key="`${lineIndex}-${charIndex}`"
            :class="getCharClass(lineIndex, charIndex)"
            :data-line="lineIndex"
            :data-char="charIndex"
            @mousedown="startSelection(lineIndex, charIndex)"
            @touchstart="handleTouchStart($event, lineIndex, charIndex)"
            @mouseenter="extendSelection(lineIndex, charIndex)"
            @touchmove="handleTouchMove"
          >
            {{ char }}
          </span>
        </div>
      </div>
      
      <div class="controls">
        <button class="btn btn-warning" @click="finishTest">Завершить</button>
        <div class="timer">{{ formattedTime }}</div>
      </div>
      
      <div class="found-words">
        <h6>Найденные слова: {{ selectedWords.length }}</h6>
        <div class="word-badges">
          <div class="word-badge" v-for="(word, idx) in selectedWords" :key="idx">
            {{ word }}
          </div>
        </div>
      </div>

      <!-- Модальное окно по окончании времени -->
      <div v-if="showTimeUpModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Время вышло!</h3>
          <p>Тест завершен по истечении времени.</p>
          <button class="btn btn-primary" @click="finishTest">Результаты</button>
        </div>
      </div>
    </div>

    <!-- Экран результатов -->
    <div v-if="screen === 'result'" class="result-screen">
      <h2>Результаты</h2>
      <p>Найдено слов: <strong>{{ correctWordsCount }}</strong> из {{ wordsToFind.length }}</p>
      <p>Уровень внимания: <strong>{{ attentionLevel }}</strong></p>
      
      <div v-if="showDetails" class="results-details">
        <h5>Детали результатов:</h5>
        <p>Правильно найденные слова: <span class="text-success">{{ correctWords.join(', ') }}</span></p>
        <p>Пропущенные слова: <span class="text-danger">{{ missedWords.join(', ') }}</span></p>
        <p>Лишние слова: <span class="text-warning">{{ extraWords.join(', ') }}</span></p>
      </div>
      
      <div class="buttons-container">
        <button class="btn btn-primary" @click="restartTest">Попробовать снова</button>
        <button class="btn btn-primary" @click="goToMenu">Вернуться в меню</button>
        <button class="btn btn-info" @click="showDetails = !showDetails">
          {{ showDetails ? 'Скрыть детали' : 'Показать детали' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api';
export default {
  name: 'MunsterbergTest',
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
      testActive: false,
      showTimeUpModal: false,
      showDetails: false,
      
      // Для работы теста
      currentSelection: [],
      selectedWords: [],
      wordIndices: [],
      textLines: [],
      touchStartPos: null,
      isSelecting: false,
      lastTouchIndex: null
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    correctWords() {
      return this.wordsToFind.filter(word => 
        this.guessedWords.some(guessed => 
          guessed.toLowerCase() === word.toLowerCase()
        )
      );
    },
    correctWordsCount() {
      return this.correctWords.length;
    },
    missedWords() {
      return this.wordsToFind.filter(word => 
        !this.guessedWords.some(guessed => 
          guessed.toLowerCase() === word.toLowerCase()
        )
      );
    },
    extraWords() {
      return this.guessedWords.filter(guessed => 
        !this.wordsToFind.some(word => 
          word.toLowerCase() === guessed.toLowerCase()
        )
      );
    },
    attentionLevel() {
      const percentage = (this.correctWordsCount / this.wordsToFind.length) * 100;
      if (percentage < 50) return 'Низкий';
      if (percentage < 70) return 'Средний';
      return 'Высокий';
    }
  },
  methods: {
    saveTestResultToLocalStorage(testId, result) {
      const key = `test_${testId}`;
      localStorage.setItem(key, JSON.stringify(result));
    },
    async goToMenu() {
      const testResult = {
        id: Date.now(),
        test: this.testId,
        user: parseInt(localStorage.getItem('user_id')),
        try_number: 1,
        number_all_answers: this.wordsToFind.length,
        number_correct_answers: this.correctWordsCount,
        complete_time: new Date().toISOString(),
        accuracy: this.attentionLevel,
        missed_words: this.missedWords.join(','),
        extra_words: this.extraWords.join(',')
      };
      
      this.saveTestResultToLocalStorage(testResult.test, testResult);
      await sendTestResult(testResult);
      
      this.$router.push('/menu');
    },
    startTest() {
      this.screen = 'test';
      this.guessedWords = [];
      this.selectedWords = [];
      this.wordIndices = [];
      this.timeLeft = 120;
      this.showTimeUpModal = false;
      this.generateLetterGrid();
      this.startTimer();
      this.testActive = true;
    },
    generateLetterGrid() {
      const rows = 40;
      const cols = 50;
      const gridSize = rows * cols;
      const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      let gridArray = Array(gridSize).fill(null);
      let placedWords = [];

      const placeWordHorizontally = (word) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
          attempts++;
          
          const row = Math.floor(Math.random() * rows);
          const startCol = Math.floor(Math.random() * (cols - word.length));
          const startIndex = row * cols + startCol;
          
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

      const shuffledWords = [...this.wordsToFind].sort(() => Math.random() - 0.5);
      shuffledWords.forEach(placeWordHorizontally);

      const missedWords = this.wordsToFind.filter(word => !placedWords.includes(word));
      if (missedWords.length > 0) {
        missedWords.forEach(placeWordHorizontally);
      }

      for (let i = 0; i < gridArray.length; i++) {
        if (gridArray[i] === null) {
          gridArray[i] = letters[Math.floor(Math.random() * letters.length)];
        }
      }

      this.letterGrid = [];
      for (let row = 0; row < rows; row++) {
        const start = row * cols;
        const end = start + cols;
        this.letterGrid.push(gridArray.slice(start, end).join(''));
      }
      this.letterGrid = this.letterGrid.join('\n');
      this.textLines = this.letterGrid.split('\n').map(line => line.split(''));
      
      this.wordsToFind = placedWords;
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          clearInterval(this.timer);
          this.showTimeUpModal = true;
          this.testActive = false;
        }
      }, 1000);
    },
    showResults() {
      this.showTimeUpModal = false;
      this.finishTest();
    },
    finishTest() {
      this.testActive = false;
      clearInterval(this.timer);
      this.guessedWords = this.selectedWords;
      this.screen = 'result';
    },
    restartTest() {
      this.screen = 'start';
    },
    saveResults() {
      console.log('Результаты сохранены:', {
        correct: this.correctWordsCount,
        total: this.wordsToFind.length,
        words: this.guessedWords
      });
      this.$emit('return-to-menu');
    },
    // Методы для работы с выделением текста
    getCharClass(lineIndex, charIndex) {
      const isSelected = this.currentSelection.some(
        pos => pos.line === lineIndex && pos.char === charIndex
      );
      const isInWord = this.wordIndices.some(word => 
        word.some(pos => pos.line === lineIndex && pos.char === charIndex)
      );
      
      if (isSelected) return 'currently-selected';
      if (isInWord) return 'word-highlighted';
      return '';
    },
    startSelection(lineIndex, charIndex) {
      this.isSelecting = true;
      this.currentSelection = [{ line: lineIndex, char: charIndex }];
      this.lastTouchIndex = { line: lineIndex, char: charIndex };
    },
    handleTouchStart(event, lineIndex, charIndex) {
      event.preventDefault();
      this.startSelection(lineIndex, charIndex);
      this.touchStartPos = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    },
    extendSelection(lineIndex, charIndex) {
      if (!this.isSelecting) return;
      
      this.lastTouchIndex = { line: lineIndex, char: charIndex };
      this.updateSelection();
    },
    handleTouchMove(event) {
      if (!this.isSelecting) return;
      
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (element && element.dataset.line !== undefined) {
        const lineIndex = parseInt(element.dataset.line);
        const charIndex = parseInt(element.dataset.char);
        
        if (!this.lastTouchIndex || 
            this.lastTouchIndex.line !== lineIndex || 
            this.lastTouchIndex.char !== charIndex) {
          this.lastTouchIndex = { line: lineIndex, char: charIndex };
          this.updateSelection();
        }
      }
    },
    updateSelection() {
      if (!this.lastTouchIndex) return;
      
      const start = this.currentSelection[0];
      const end = this.lastTouchIndex;
      
      if (start.line === end.line) {
        const minChar = Math.min(start.char, end.char);
        const maxChar = Math.max(start.char, end.char);
        
        this.currentSelection = Array.from(
          { length: maxChar - minChar + 1 },
          (_, i) => ({ line: start.line, char: minChar + i })
        );
      }
    },
    handleSelection() {
      this.isSelecting = false;
      this.saveSelectedWord();
    },
    cancelSelection() {
      this.isSelecting = false;
      this.currentSelection = [];
    },
    saveSelectedWord() {
      if (this.currentSelection.length < 2) {
        this.currentSelection = [];
        return;
      }
      
      const sortedSelection = [...this.currentSelection].sort((a, b) => a.char - b.char);
      const word = sortedSelection
        .map(pos => this.textLines[pos.line][pos.char])
        .join('');
      
      if (word.length >= 2 && !this.selectedWords.includes(word)) {
        this.selectedWords.push(word);
        this.wordIndices.push(sortedSelection);
      }
      
      this.currentSelection = [];
    }
  },
  mounted() {
    document.addEventListener('touchmove', this.preventScroll, { passive: false });
  },
  beforeUnmount() {
    document.removeEventListener('touchmove', this.preventScroll);
    clearInterval(this.timer);
  }
}
</script>

<style scoped>
/* Стартовый экран */
.start-screen {
  text-align: center;
  padding: 20px;
}
.start-screen h2 {
  margin-bottom: 20px;
}
.start-screen p {
  margin-bottom: 30px;
  font-size: 18px;
}
.start-screen .btn {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
}

/* Экран теста */
.test-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.letter-grid {
  font-family: monospace;
  font-size: 18px;
  line-height: 1.8;
  white-space: pre-wrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  overflow-x: auto;
}

.text-line {
  white-space: pre;
  display: block;
}

.currently-selected {
  background-color: #ffeb3b;
  color: #000;
  border-radius: 2px;
  padding: 0 1px;
}

.word-highlighted {
  background-color: #a5d6a7;
  color: #000;
  border-radius: 2px;
  padding: 0 1px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: #dc3545;
}

.found-words {
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.word-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.word-badge {
  display: inline-block;
  background: #e0e0e0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 80%;
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
  color: #dc3545;
}

/* Экран результатов */
.result-screen {
  text-align: center;
  padding: 20px;
}

.results-details {
  margin: 20px auto;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  text-align: left;
  max-width: 600px;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  min-width: 200px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.text-success { color: #28a745; }
.text-danger { color: #dc3545; }
.text-warning { color: #ffc107; }

@media (max-width: 600px) {
  .letter-grid {
    font-size: 16px;
    line-height: 2;
  }
  
  .word-badge {
    font-size: 12px;
    padding: 3px 8px;
  }
  
  .btn {
    min-width: 160px;
    font-size: 14px;
    padding: 8px 16px;
  }
  
  .timer {
    font-size: 1rem;
  }
}
</style>
