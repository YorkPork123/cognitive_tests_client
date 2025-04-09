<template>
  <div class="text-center">
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
      <button class="btn btn-primary" @click="$emit('restart-test')">Попробовать снова</button>
      <button class="btn btn-primary" @click="goToMenu">Вернуться в меню</button>
      <button class="btn btn-info" @click="showDetails = !showDetails">
        {{ showDetails ? 'Скрыть детали' : 'Показать детали' }}
      </button>
    </div>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api';

export default {
  name: 'ResultScreen',
  props: {
    guessedWords: {
      type: Array,
      default: () => []
    },
    wordsToFind: {
      type: Array,
      required: true
    },
    testId: {
      type: Number,
      default: 1
    },
    isExamMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDetails: false
    };
  },
  computed: {
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
      if (percentage < 30) return 'Очень низкий';
      if (percentage < 50) return 'Низкий';
      if (percentage < 70) return 'Средний';
      if (percentage < 90) return 'Выше среднего';
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
      
      if (this.isExamMode) {
        await sendTestResult(testResult);
      }
      
      this.$router.push('/menu');
    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.btn {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  min-width: 200px;
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
}

.text-success { color: #28a745; }
.text-danger { color: #dc3545; }
.text-warning { color: #ffc107; }

@media (max-width: 600px) {
  .btn {
    width: 100%;
    margin: 5px 0;
  }
  .results-details {
    padding: 10px;
  }
}
</style>