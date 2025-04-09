<template>
  <div>
    <h5 class="text-center mb-3">Выделите найденные слова в тексте ниже</h5>
    <div
      class="bg-light p-3 mb-3 text-monospace letter-grid"
      ref="textContainer"
      @mouseup="handleSelection"
    >
      <span
        v-for="(char, index) in processedText"
        :key="index"
        :class="{ 'highlighted': highlightedIndices.includes(index) }"
        @mousedown="startSelection(index)"
        @mouseenter="extendSelection(index)"
      >
        {{ char }}
      </span>
    </div>
    
    <div class="d-flex justify-content-between">
      <button class="btn btn-warning" @click="finishTest">Завершить</button>
      <div class="text-danger">{{ timeLeft }} секунд осталось</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestScreen',
  props: ['letterGrid', 'timeLeft'],
  data() {
    return {
      highlightedIndices: [],
      selectionStart: null,
      isSelecting: false,
      selectedWords: []
    }
  },
  computed: {
    processedText() {
      return this.letterGrid.split('');
    }
  },
  methods: {
    startSelection(index) {
      this.isSelecting = true;
      this.selectionStart = index;
      if (!event.ctrlKey) {
        this.highlightedIndices = [];
      }
      this.toggleHighlight(index);
    },
    extendSelection(index) {
      if (!this.isSelecting) return;
      
      const start = Math.min(this.selectionStart, index);
      const end = Math.max(this.selectionStart, index);
      
      this.highlightedIndices = [
        ...this.highlightedIndices.filter(i => i < start || i > end),
        ...Array.from({ length: end - start + 1 }, (_, i) => start + i)
      ];
    },
    handleSelection() {
      this.isSelecting = false;
      this.extractSelectedWords();
    },
    toggleHighlight(index) {
      const position = this.highlightedIndices.indexOf(index);
      if (position === -1) {
        this.highlightedIndices.push(index);
      } else {
        this.highlightedIndices.splice(position, 1);
      }
    },
    extractSelectedWords() {
      if (this.highlightedIndices.length === 0) return;
      
      const sortedIndices = [...this.highlightedIndices].sort((a, b) => a - b);
      let words = [];
      let currentWord = '';
      let prevIndex = sortedIndices[0] - 1;
      
      sortedIndices.forEach(index => {
        const char = this.letterGrid[index];
        if (index === prevIndex + 1) {
          currentWord += char;
        } else {
          if (currentWord) words.push(currentWord);
          currentWord = char;
        }
        prevIndex = index;
      });
      
      if (currentWord) words.push(currentWord);
      this.selectedWords = words.filter(word => word.length > 1);
    },
    finishTest() {
      this.extractSelectedWords();
      this.$emit('finish-test', this.selectedWords);
    }
  }
}
</script>

<style scoped>
.letter-grid {
  line-height: 1.5;
  white-space: pre-wrap;
  user-select: none;
  font-family: monospace;
}

.highlighted {
  background-color: #ffeb3b;
  color: #000;
  border-radius: 2px;
  padding: 0 1px;
}

@media (max-width: 600px) {
  .letter-grid {
    font-size: 11px; 
  }
  h5 {
    font-size: 14px; 
  }
  .btn {
    font-size: 10px; 
    padding: 0.25rem 0.5rem; 
  }
  .text-danger {
    font-size: 12px; 
  }
}
</style>