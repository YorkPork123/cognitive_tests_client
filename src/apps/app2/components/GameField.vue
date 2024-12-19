<template>
    <div class="game-rectangle">
      <div class="game-header">
        <div class="total-timer">⏱️ {{ totalTimeLeft }} сек.</div>
        <div class="lives">
          <span v-for="life in lives" :key="life" class="life">❤️</span>
        </div>
      </div>
      <SequenceDisplay :sequence="sequence" :opacity-level="opacityLevel" />
      <div class="timer">Ход: {{ timeLeft }} сек.</div>
      <GameControls @answer="handleAnswer" />
    </div>
  </template>

  <script>
  import { ref, onMounted, onUnmounted } from "vue";
  import SequenceDisplay from "./SequenceDisplay.vue";
  import GameControls from "./GameControls.vue";

  export default {
    components: {
      SequenceDisplay,
      GameControls,
    },
    emits: ["game-over"],
    setup(_, { emit }) {

    const generateSequence = (length) =>
        Array.from({ length }, () => Math.floor(Math.random() * 10));
      const sequence = ref(generateSequence(3));
      const opacityLevel = ref(1);
      const lives = ref(3);
      const score = ref(0);

      const timeLeft = ref(2); // Таймер хода
      const totalTimeLeft = ref(90); // Общий таймер (90 секунд)

      let turnTimerInterval, totalTimerInterval;

      const shiftSequence = () => {
        sequence.value.shift();
        sequence.value.push(Math.floor(Math.random() * 10));
        resetTurnTimer();
      };

      const handleAnswer = (isMatch) => {
        const correct = sequence.value[0] === sequence.value[2];
        if (isMatch === correct) {
          score.value += 20;
          opacityLevel.value = Math.max(0.2, opacityLevel.value - 0.2);
          shiftSequence();
        } else {
          handleWrongAnswer();
        }
      };

      const handleWrongAnswer = () => {
        lives.value -= 1;
        opacityLevel.value = 1;
        if (lives.value <= 0) {
          endGame();
        } else {
          resetTurnTimer();
        }
      };

      const resetTurnTimer = () => {
        timeLeft.value = 2;
      };

      const startTurnTimer = () => {
        turnTimerInterval = setInterval(() => {
          timeLeft.value -= 1;
          if (timeLeft.value <= 0) {
            shiftSequence(); // Просто сдвигаем последовательность, не отнимая жизни
          }
        }, 1000);
      };

      const startTotalTimer = () => {
        totalTimerInterval = setInterval(() => {
          totalTimeLeft.value -= 1;
          if (totalTimeLeft.value <= 0) {
            endGame();
          }
        }, 1000);
      };

      const endGame = () => {
        clearInterval(turnTimerInterval);
        clearInterval(totalTimerInterval);
        emit("game-over", score.value);
      };

      onMounted(() => {
        startTurnTimer();
        startTotalTimer();
      });

      onUnmounted(() => {
        clearInterval(turnTimerInterval);
        clearInterval(totalTimerInterval);
      });

      return {
        sequence,
        opacityLevel,
        lives,
        score,
        timeLeft,
        totalTimeLeft,
        handleAnswer,
      };
    },
  };
  </script>

  <style scoped>
  .game-rectangle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 450px;
    background-color: #ffffff;
    border: 2px solid #cccccc;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: auto;
    position: relative;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px 20px;
  }

  .total-timer {
    font-size: 1rem;
    font-weight: bold;
    color: #007bff;
  }

  .lives {
    display: flex;
  }

  .life {
    font-size: 1.5rem;
    margin: 0 5px;
  }

  .timer {
    font-size: 1.2rem;
    font-weight: bold;
    color: #ff6b6b;
    margin-top: 10px;
  }
  </style>
