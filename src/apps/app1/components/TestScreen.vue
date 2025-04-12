<template>
  <div class="test-container">
    <h5 class="text-center mb-3">Выделите найденные слова в тексте ниже</h5>
    
    <div class="text-wrapper">
      <div
        class="letter-grid"
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
      isSelecting: false,
      fontSize: 16 // Начальный размер шрифта
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
        this.$nextTick(this.adjustFontSize);
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.adjustFontSize);
    document.addEventListener('touchmove', this.preventScroll, { passive: false });
    this.adjustFontSize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustFontSize);
    document.removeEventListener('touchmove', this.preventScroll);
  },
  methods: {
    adjustFontSize() {
      // Автоподбор размера шрифта под экран
      const container = this.$refs.textContainer;
      if (!container) return;
      
      let fontSize = 16;
      let fits = false;
      
      // Проверяем, помещается ли текст
      const checkFit = () => {
        container.style.fontSize = `${fontSize}px`;
        return container.scrollWidth <= container.clientWidth;
      };
      
      // Уменьшаем шрифт пока текст не поместится
      while (fontSize > 10 && !fits) {
        fits = checkFit();
        if (!fits) fontSize -= 1;
      }
      
      this.fontSize = fontSize;
    },
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
          if (start.line === lineIndex) {
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
.test-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.text-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}

.letter-grid {
  font-family: monospace;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  height: 100%;
  overflow-y: auto;
  padding: 5px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.text-line {
  white-space: pre;
  line-height: 1.8;
  word-break: keep-all;
  display: block;
  margin: 0;
  font-size: v-bind('fontSize + "px"');
}

.currently-selected {
  background-color: #ffeb3b;
  color: #000;
  border-radius: 3px;
  padding: 0 1px;
}

.word-highlighted {
  background-color: #a5d6a7;
  color: #000;
  border-radius: 3px;
  padding: 0 1px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.btn {
  padding: 10px 20px;
  min-width: 120px;
}

.timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: #dc3545;
}

.found-words {
  border-top: 1px solid #eee;
  padding-top: 10px;
  max-height: 20vh;
  overflow-y: auto;
}

.word-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.word-badge {
  background: #e0e0e0;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
}

/* Увеличиваем область касания для букв */
.text-line span {
  padding: 3px 1px;
  display: inline-block;
  min-width: 14px;
  text-align: center;
}

@media (max-width: 480px) {
  .text-line {
    line-height: 2;
  }
  
  .btn {
    padding: 8px 12px;
    min-width: 100px;
    font-size: 0.9rem;
  }
  
  .timer {
    font-size: 1rem;
  }
  
  .word-badge {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
  
  .text-line span {
    min-width: 12px;
  }
}
</style>
