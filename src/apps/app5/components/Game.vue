<template>
  <div class="game" @keydown.space.prevent="handleSpace" tabindex="0">
    <div class="score">Счёт: {{ score }}</div>
    <div class="text-display" :style="{ color: currentColor }">
      {{ currentText }}
    </div>
    <div class="game-field">
      <div
        class="circle"
        :style="{ top: circlePosition.y + 'px', left: circlePosition.x + 'px' }"
        @mouseenter="cursorInside = true"
        @mouseleave="cursorInside = false"
      ></div>
    </div>
    <button @click="endGame">Закончить</button>
  </div>
</template>

<script>
export default {
  name: "Game",
  data() {
    return {
      score: 0,
      timeLeft: 60000,
      currentText: "",
      currentColor: "",
      colors: ["красный", "зелёный", "синий", "жёлтый", "фиолетовый", "оранжевый", "чёрный"],
      colorValues: ["red", "green", "blue", "yellow", "purple", "orange", "black"],
      circlePosition: { x: 100, y: 100 },
      circleSpeed: { x: 1, y: 1 },
      cursorInside: false,
      interval: null,
      circleInterval: null,
      hasClicked: false,
    };
  },
  methods: {
    startGame() {
      this.updateText();
      this.interval = setInterval(this.updateText, 3000);
      this.moveCircle();
      setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.endGame();
        }
      }, 1000);
    },
    updateText() {
      const randomIndex = Math.floor(Math.random() * this.colors.length);
      this.currentText = this.colors[randomIndex];
      this.currentColor = this.colorValues[Math.floor(Math.random() * this.colorValues.length)];
      this.hasClicked = false;
    },
    moveCircle() {
      this.circleInterval = setInterval(() => {
        let newX = this.circlePosition.x + this.circleSpeed.x;
        let newY = this.circlePosition.y + this.circleSpeed.y;

        // Проверка на столкновение с краями игрового поля
        if (newX < 0 || newX > 350) this.circleSpeed.x *= -1;
        if (newY < 0 || newY > 350) this.circleSpeed.y *= -1;

        this.circlePosition.x = newX;
        this.circlePosition.y = newY;
      }, 20); // Обновление позиции каждые 20 мс
    },
    saveTestResultToLocalStorage(testId, result) {
      const key = `test_${testId}`;
      localStorage.setItem(key, JSON.stringify(result));
    },
    endGame() {
      clearInterval(this.interval);
      clearInterval(this.circleInterval);

      // Формируем результат теста
      const testResult = {
        testId: 1,  // Идентификатор теста (замените на актуальный)
        score: this.score,
        timeLeft: this.timeLeft,
        // Добавьте другие данные, которые нужно сохранить
      };

      // Сохраняем результат в localStorage
      this.saveTestResultToLocalStorage(testResult.testId, testResult);

      // Отображаем диалоговое окно с результатами
      const userConfirmed = window.confirm(`Игра окончена! Ваш счёт: ${this.score}\nНажмите "ОК", чтобы перейти к результатам всех тестов.`);

      if (userConfirmed) {
        // Переход на страницу результатов
        this.$router.push('/results');
      }

      this.$emit("endGame");
    },
  },
  mounted() {
    this.startGame();
    const circle = document.querySelector('.circle');
    const radius = circle.offsetWidth / 2;
    const centerX = radius;
    const centerY = radius;

    circle.addEventListener('click', (event) => {
      const dx = event.offsetX - centerX;
      const dy = event.offsetY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= 50) {
          const textMatchesColor = this.currentText === this.colors[this.colorValues.indexOf(this.currentColor)];
          if (this.hasClicked === false) {
            if (textMatchesColor) {
            console.log("Right");
            this.score += 20; // Начисление очков за правильное действие
          } else {
            console.log("Not right");
          }
          }
          this.hasClicked = true;
      }
  });
  },
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.circleInterval);
    window.removeEventListener("keydown", this.handleSpace);
  },
};
</script>

<style>
.game {
  position: relative;
  margin: 20px;
}
.score {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  font-weight: bold;
}
.text-display {
  margin: 20px 0;
  font-size: 24px;
  font-weight: bold;
}
.game-field {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
  background-color: #eef;
  border: 1px solid #ccc;
  overflow: hidden;
}
.circle {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #ff6347;
  border-radius: 50%;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>