<template>
  <div>
    <h5 class="text-center mb-3">Выделите найденные слова в тексте ниже</h5>
    <div
      class="bg-light p-3 mb-3 text-monospace letter-grid"
      ref="textContainer"
      @mouseup="handleSelection"
      @touchend="handleTouchEnd"
    >
      <span
        v-for="(char, index) in processedText"
        :key="index"
        :class="getCharClass(index)"
        @mousedown="startSelection(index)"
        @touchstart="handleTouchStart($event, index)"
        @mouseenter="extendSelection(index)"
        @touchmove="handleTouchMove"
      >
        {{ char }}
      </span>
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
      touchStartIndex: null,
      isTouchSelecting: false
    }
  },
  computed: {
    processedText() {
      return this.letterGrid.replace(/\n/g, '').split('');
    },
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  },
  methods: {
    getCharClass(index) {
      if (this.currentSelection.includes(index)) return 'currently-selected';
      const isInWord = this.wordIndices.some(indices => indices.includes(index));
      return isInWord ? 'word-highlighted' : '';
    },
    startSelection(index) {
      this.currentSelection = [index];
    },
    handleTouchStart(event, index) {
      this.touchStartIndex = index;
      this.isTouchSelecting = true;
      this.currentSelection = [index];
      event.preventDefault();
    },
    handleTouchMove(event) {
      if (!this.isTouchSelecting) return;
      
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.getAttribute('key')) {
        const index = parseInt(element.getAttribute('key'));
        this.extendSelection(index);
      }
    },
    handleTouchEnd() {
      this.handleSelection();
      this.isTouchSelecting = false;
    },
    extendSelection(index) {
      if (this.currentSelection.length === 0) return;
      
      const start = this.currentSelection[0];
      const end = index;
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      
      this.currentSelection = Array.from({length: max - min + 1}, (_, i) => min + i);
    },
    handleSelection() {
      if (this.currentSelection.length < 2) {
        this.currentSelection = [];
        return;
      }
      
      const sortedIndices = [...this.currentSelection].sort((a, b) => a - b);
      const word = sortedIndices.map(i => this.processedText[i]).join('');
      
      if (word.length >= 2) {
        this.selectedWords.push(word);
        this.wordIndices.push(sortedIndices);
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
  line-height: 1.8;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 18px;
  user-select: none;
  touch-action: manipulation;
}

.currently-selected {
  background-color: #ffeb3b;
  color: #000;
  border-radius: 2px;
}

.word-highlighted {
  background-color: #a5d6a7;
  color: #000;
  border-radius: 2px;
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
