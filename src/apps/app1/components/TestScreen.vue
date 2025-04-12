<template>
  <div>
    <h5 class="text-center mb-3">Выделите найденные слова в тексте ниже</h5>
    <div
      class="bg-light p-3 mb-3 text-monospace letter-grid"
      ref="textContainer"
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
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
        >
          {{ char }}
        </span>
      </div>
    </div>
    
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-warning" @click="finishTest">Завершить</button>
      <div class="text-danger timer">{{ formattedTime }}</div>
    </div>
    
    <div class="found-words mt-3">
      <h6>Найденные слова: {{ selectedWords.length }}</h6>
      <div class="word-badge" v-for="(word, idx) in selectedWords" :key="idx">
        {{ word }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestScreen',
  props: ['letterGrid', 'timeLeft'],
  data() {
    return {
      currentSelection: [],
      selectedWords: [],
      wordIndices: [],
      textLines: [],
      touchStartPos: null,
      isSelecting: false
    }
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  },
  watch: {
    letterGrid: {
      immediate: true,
      handler(newVal) {
        this.textLines = newVal.split('\n').map(line => line.split(''));
      }
    }
  },
  mounted() {
    // Для предотвращения скролла страницы при выделении
    document.addEventListener('touchmove', this.preventScroll, { passive: false });
  },
  beforeUnmount() {
    document.removeEventListener('touchmove', this.preventScroll);
  },
  methods: {
    preventScroll(e) {
      if (this.isSelecting) {
        e.preventDefault();
      }
    },
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
    handleTouchStart(e) {
      this.isSelecting = true;
      const touch = e.touches[0];
      this.touchStartPos = {
        x: touch.clientX,
        y: touch.clientY
      };
      this.updateSelectionFromTouch(touch);
    },
    handleTouchMove(e) {
      if (!this.isSelecting) return;
      const touch = e.touches[0];
      this.updateSelectionFromTouch(touch);
      e.preventDefault();
    },
    updateSelectionFromTouch(touch) {
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.dataset.line !== undefined) {
        const lineIndex = parseInt(element.dataset.line);
        const charIndex = parseInt(element.dataset.char);
        
        if (this.currentSelection.length === 0) {
          this.currentSelection = [{ line: lineIndex, char: charIndex }];
        } else {
          const start = this.currentSelection[0];
          if (start.line === lineIndex) { // Только в одной строке
            const minChar = Math.min(start.char, charIndex);
            const maxChar = Math.max(start.char, charIndex);
            
            this.currentSelection = Array.from(
              { length: maxChar - minChar + 1 },
              (_, i) => ({ line: lineIndex, char: minChar + i })
            );
          }
        }
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
      
      // Сортируем выделение
      const sortedSelection = [...this.currentSelection].sort((a, b) => a.char - b.char);
      
      const word = sortedSelection
        .map(pos => this.textLines[pos.line][pos.char])
        .join('');
      
      if (word.length >= 2 && !this.selectedWords.includes(word)) {
        this.selectedWords.push(word);
        this.wordIndices.push(sortedSelection);
      }
      
      this.currentSelection = [];
    },
    finishTest() {
      this.$emit('finish-test', this.selectedWords);
    }
  }
}
</script>

<style scoped>
.letter-grid {
  font-family: monospace;
  font-size: 22px; /* Увеличенный размер для мобильных */
  user-select: none;
  -webkit-user-select: none;
  touch-action: none; /* Отключаем стандартные touch-действия */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.text-line {
  white-space: pre;
  line-height: 2.5; /* Больше межстрочный интервал */
  word-break: keep-all;
  display: block;
}

.currently-selected {
  background-color: #ffeb3b;
  color: #000;
  border-radius: 3px;
  padding: 0 2px;
}

.word-highlighted {
  background-color: #a5d6a7;
  color: #000;
  border-radius: 3px;
  padding: 0 2px;
}

.found-words {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-bottom: 20px;
}

.word-badge {
  display: inline-block;
  background: #e0e0e0;
  padding: 6px 12px;
  margin: 4px;
  border-radius: 12px;
  font-size: 16px;
}

.timer {
  font-size: 1.2rem;
  font-weight: bold;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  min-width: 120px;
}

@media (max-width: 480px) {
  .letter-grid {
    font-size: 20px;
    line-height: 2.8;
    padding: 10px 5px;
  }
  
  .word-badge {
    font-size: 14px;
    padding: 5px 10px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 14px;
    min-width: 100px;
  }
  
  .timer {
    font-size: 1.1rem;
  }
}

/* Увеличиваем область касания для букв */
.text-line span {
  padding: 4px 1px;
  display: inline-block;
  min-width: 18px;
  text-align: center;
}
</style>
