<template>
  <div class="">
    <div v-if="!isTestStarted" >
        <h1>Тест Мюнсберга</h1>
        <p>Вам будет дано 60 секунд. </p>
        <p>За это время ваша задача найти все слова в тексте и напечатать их </p>
        <button @click="startTest">Начать тест</button>
    </div>
    <div v-else >
    <div v-if="isTimerActive">
      <h2>Оставшееся время: {{ remainingTime }} секунд</h2>
    </div>
    <h1>Тест по методике Мюнстерберга</h1>
    <h1>Всего набрано {{ allpoints }}</h1>
    <p class="word-item">{{ points }}/{{ maxim }}</p>
    <button class="butt button" @click="generateText">Создать текст</button>
    <h2 class="word-item" id="fontt">{{ generatedText }}</h2>
    <input v-model="userInput" class="styled-input" placeholder="Введите слово" />
    <button class="butt button" @click="checkWord">Проверить слово</button>
    <p class="word-item"></p>
    <h2 class="word-item" v-if="isCorrect !== null">{{ resultMessage }}</h2></div>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

export default {
  mounted() {
    
  },
  data() {
    return {
      words: [
        'яблоко', 'компьютер', 'внимание', 'лампа', 'котёл', 'самолёт', 'пилот', 'саморез', 'пила', 'будильник',
        'топор', 'петух', 'сила', 'волна', 'наушники', 'кит', 'селезень', 'ножницы', 'панама', 'груша', 'кот', 'киви'
      ],
      nowords: [
        'уцчскап', 'цукенипр', 'уцйыаемсв', 'воиагмааг', 'иагагохъ', 'фыву', 'цка', 'дру', 'волщзгмааг', 'иагохъ',
        'фыву', 'цукайй', 'дроу', 'куа', 'птх', 'переперерея', 'рей', 'жох', 'дз', 'вим', 'еае', 'шек', 'ека', 'вв'
      ],
      generatedText: '',
      userInput: '',
      isCorrect: null,
      nounsInText: [],
      points: 0,
      maxim: 0,
      allpoints: 0,
      resultMessage: '',
      isTimerActive: false,
      remainingTime: 60,
      timerInterval: null,
      isTestStarted: false,
    };
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    startTest(){
      this.isTestStarted=true,
      this.startTimer();
    },
    
    startTimer() {
      this.isTimerActive = true;
      this.remainingTime = 60;

      this.timerInterval = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          clearInterval(this.timerInterval);
          this.isTimerActive = false;
          this.finishTest(); // Завершаем тест
        }
      }, 1000);
    },
    async finishTest() {
      // Формируем результат теста
      const testResult = {
        id: Date.now(), // Уникальный ID
        test: parseInt(localStorage.getItem('test_id')), // Идентификатор теста
        user: parseInt(localStorage.getItem('user_id')), // Идентификатор пользователя
        try_number: 1, // Номер попытки
        number_all_answers: this.maxim, // Общее количество найденных слов
        number_correct_answers: this.points, // Количество правильных ответов
        complete_time: new Date().toISOString(), // Время завершения теста
        accuracy: (this.points / this.maxim * 100).toFixed(0), // Точность в процентах
      };

      // Сохраняем результат в localStorage
      localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

      // Отправляем результат на сервер
      try {
        await sendTestResult(testResult);
        alert(
          `Тест завершен!\nВы нашли ${this.points} ${this.allpoints} слов за 60 секунд!\nМожете перейти к следующему тесту.`
        );
        this.$router.push('/menu'); // Возвращаемся в меню
      } catch (error) {
        console.error('Ошибка при отправке результата:', error);
        alert('Произошла ошибка при отправке результата. Попробуйте снова.');
      }
    },
    generateText() {
      this.resultMessage = '';
      this.points = 0;
      const randomWords = Array.from({ length: 20 }, () => {
        const isNoun = Math.random() < 0.5;
        return isNoun
          ? this.words[Math.floor(Math.random() * this.words.length)]
          : this.nowords[Math.floor(Math.random() * this.nowords.length)];
      });
      this.generatedText = randomWords.join('');
      this.uniqueNouns = this.getUnique(randomWords.filter(word => this.words.includes(word)));
      this.maxim = this.uniqueNouns.length;
      console.log(this.uniqueNouns);
    },
    getUnique(arr) {
      return arr.filter((el, ind) => ind === arr.indexOf(el));
    },
    checkWord() {
      this.isCorrect = this.uniqueNouns.includes(this.userInput);

      if (this.isCorrect) {
        this.uniqueNouns = this.uniqueNouns.filter(item => item !== this.userInput);
        this.points += 1;
        this.resultMessage = 'Вы нашли слово!';
      } else {
        this.resultMessage = 'Нет такого слова!';
      }

      if (this.points === this.maxim) {
        this.allpoints += 1;
        this.generateText();
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 30px;
  margin: 5px;
}
.word-item {
  word-break: break-word;
  margin: 10px 0;
  font-size: 26px;
}

.button {
  background-color: #5092dd;
  color: black;
  border: none;
  padding: 15px 13px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 25px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
  width: 80%; 
}

.styled-input {
  padding: 10px;
  border: 2px solid #007bff;
  border-radius: 5px;
  font-size: 20px;
  transition: border-color 0.3s;
  box-sizing: border-box; 
}

.styled-input:focus {
  border-color: #0056b3;
  outline: none;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding: 20px;
}

@media (max-width: 600px) {
  h1 {
    font-size: 20px; 
  }

  h2 {
    font-size: 18px; 
  }

  .word-item {
    font-size: 16px; 
    margin: 5px 0; 
    padding: 0 40px;
  }

  .button {
    font-size: 16px; 
    padding: 10px 8px; 
  }

  .styled-input {
    font-size: 16px; 
  }

  .container {
    padding: 10px; 
  }
}
</style>
