<template>
  <div>
    <h5 class="text-center mb-3">Выделите найденные слова в тексте ниже</h5>
    <div
      class="bg-light p-3 mb-3 text-monospace letter-grid"
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
        >
          {{ char }}
        </span>
      </div>
    </div>
    
    <div class="d-flex justify-content-between">
      <button class="btn btn-warning" @click="finishTest">Завершить</button>
      <div class="text-danger">{{ formattedTime }} осталось</div>
    </div>
    
    <div class="found-words mt-3">
      <h6>Найденные слова:</h6>
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
      if this.timeLeft == 0 {
        this.finishTEst();
      }
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
  methods: {
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
      
      const start = this.currentSelection[0];
      const end = { line: lineIndex, char: charIndex };
      
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
  font-size: 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  overflow-x: auto;
}

.text-line {
  white-space: pre;
  line-height: 1.8;
  word-break: keep-all;
}

.currently-selected {
  background-color: #ffeb3b;
  color: #000;
  border-radius: 3px;
}

.word-highlighted {
  background-color: #a5d6a7;
  color: #000;
  border-radius: 3px;
}

.found-words {
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.word-badge {
  display: inline-block;
  background: #e0e0e0;
  padding: 2px 8px;
  margin: 2px;
  border-radius: 10px;
  font-size: 14px;
}

@media (max-width: 600px) {
  .letter-grid {
    font-size: 16px;
    line-height: 2;
  }
  
  .word-badge {
    font-size: 12px;
  }
}
</style>
