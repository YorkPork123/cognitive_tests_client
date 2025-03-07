<template>
  <div id="app" class="fixerr">
    <h1>Тест на кратковременную память</h1>
    <div v-if="isTimerActive">
      <h2>Оставшееся время: {{ remainingTime }} секунд</h2>
    </div>
    <h3>Правильные ответы: {{ right }} : {{ wrong }} Неправильные ответы</h3>
    <div>
      <br />
      <div class="selected-images" v-if="!isMatrixVisible">
        <h2>Запомните эти картинки за 5 секунд:</h2>
        <div v-for="(image, index) in selectedImages" :key="index" class="image">
          <img :src="imagePaths[image]" alt="Selected Image" />
        </div>
      </div>
      <div v-if="isMatrixVisible">
        <h2>Выберите такие же картинки:</h2>
        <br />
        <div class="image-grid">
          <div
            v-for="(image, index) in imageGrid"
            :key="index"
            class="grid-item"
            :class="{ selected: isCorrectImage(image) }"
            @click="checkImage(image)"
          >
            <img :src="imagePaths[image]" alt="Grid Image" />
          </div>
        </div>
      </div>
      <button class="exit-button" @click="exitToMenu">Выйти в меню</button>
    </div>
  </div>
</template>

<script>
import { sendTestResult } from '@/services/api'; // Импортируем метод для отправки данных

// Используем import.meta.glob для динамической загрузки изображений
const imageModules = import.meta.glob('@/assets/icons/*.png', { eager: true });

export default {
  data() {
    return {
      allImages: [
          'apple_fruit_food_icon_218380.webp',
          'apricot_fruit_food_icon_218401.png',
          'banana_fruit_food_icon_218382.png',
          'beverages_drink_milkshake_drink_icon_261886.png',
          'calendar_icon_161516.png',
          'carambola_fruit_food_icon_218402.png',
          'crown_king_queen_icon_161518.png',
          'custard_apple_fruit_food_icon_218403.png',
          'dates_fruit_food_icon_218405.png',
          'dragon_fuit_fruit_food_icon_218394.png',
          'durian_fruit_food_icon_218387.png',
          'food_burger_junk_food_icon_261883.png',
          'food_hot_pocket_fish_and_chips_junk_food_icon_261881.png',
          'food_junk_food_hot_pocket_icon_261880.png',
          'food_junk_food_ice_cream_icon_261878.png',
          'food_pizza_junk_food_icon_261884.png',
          'food_potatoes_junk_food_fries_icon_261877.png',
          'food_potatoes_junk_food_fries_icon_261879.png',
          'gift_box_icon_161515.png',
          'grape_fruit_food_icon_218400.png',
          'guava_fruit_food_icon_218390.png',
          'jackfruit_fruit_food_icon_218408.png',
          'kiwi_fruit_food_icon_218384.png',
          'lemon_fruit_food_icon_218391.png',
          'lychee_fruit_food_icon_218381.png',
          'mango_fruit_food_icon_218383.png',
          'mangosteen_fruit_food_icon_218389.png',
          'melon_fruit_food_icon_218393.png',
          'papaya_fruit_food_icon_218395.png',
          'passion_fruit_fruit_food_icon_218406.png',
          'peach_fruit_food_icon_218397.png',
          'peanut_fruit_food_icon_218388.png',
          'pear_fruit_food_icon_218392.png',
          'pineapple_fruit_food_icon_218399.png',
          'pomegranate_fruit_food_icon_218396.png',
          'raspberry_fruit_food_icon_218398.png',
          'rose_apple_fruit_food_icon_218404.png',
          'shopping_bag_icon_161525.png',
          'soursop_fruit_food_icon_218407.png',
          'strawberry_fruit_food_icon_218386.png',
          'trumpet_music_musical_instrument_icon_161526.png',
          'watermelon_fruit_food_icon_218385.png',
          'xmas_bell_christmas_decoration_emoji_icon_260231.png',
          'xmas_candle_christmas_decoration_emoji_icon_260225.png',
          'xmas_cane_emoji_christmas_decoration_icon_260222.png',
          'xmas_cherry_christmas_decoration_emoji_icon_260233.png',
          'xmas_christmas_bag_gifts_emoji_icon_260234.png',
          'xmas_christmas_light_emoji_decoration_icon_260232.png',
          'xmas_christmas_tree_emoji_icon_260217.png',
          'xmas_cookie_emoji_christmas_icon_260220.png',
          'xmas_crown_christmas_decoration_emoji_icon_260228.png',
          'xmas_flower_christmas_decoration_emoji_icon_260230.png',
          'xmas_gift_box_present_christmas_emoji_icon_260223.png',
          'xmas_gingerbread_christmas_emoji_icon_260224.png',
          'xmas_milk_emoji_icon_260219.png',
          'xmas_mitten_christmas_glove_emoji_icon_260229.png',
          'xmas_santa_hat_christmas_emoji_icon_260221.png',
          'xmas_sock_christmas_decoration_emoji_icon_260226.png',
          'xmas_sphere_christmas_decoration_emoji_icon_260218.png',
          'xmas_star_christmas_decoration_emoji_icon_260227.png',
        ],
      selectedImages: [],
      imageGrid: [],
      foundImages: [],
      right: 0,
      wrong: 0,
      isMatrixVisible: false,
      isTimerActive: false,
      remainingTime: 60,
      timerInterval: null,
      imagePaths: {}, // Объект для хранения путей к изображениям
    };
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    async loadImages() {
      // Загружаем изображения и сохраняем их пути в объекте imagePaths
      for (const image of this.allImages) {
        const imagePath = `src/assets/icons/${image}`;
        if (imageModules[imagePath]) {
          this.imagePaths[image] = imageModules[imagePath].default;
        } else {
          console.error(`Изображение не найдено: ${imagePath}`);
        }
      }
    },
    showAlert() {
      alert(
        'Тест 5\n Вам будет дано 60 секунд. \n Дается 5 секунд чтобы запомнить 3 картинки, их необходимо найти в матрице'
      );
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
        number_all_answers: this.right + this.wrong, // Общее количество ответов
        number_correct_answers: this.right, // Количество правильных ответов
        complete_time: new Date().toISOString(), // Время завершения теста
        accuracy: (this.right / (this.right + this.wrong) * 100).toFixed(0), // Точность в процентах
      };

      // Сохраняем результат в localStorage
      localStorage.setItem(`test_${testResult.test}`, JSON.stringify(testResult));

      // Отправляем результат на сервер
      try {
        await sendTestResult(testResult);
        alert(
          `Тест завершен!\nПравильных ответов: ${this.right}\nНеправильных ответов: ${this.wrong}\nТочность: ${testResult.accuracy}%`
        );
        this.$router.push('/menu'); // Возвращаемся в меню
      } catch (error) {
        console.error('Ошибка при отправке результата:', error);
        alert('Произошла ошибка при отправке результата. Попробуйте снова.');
      }
    },
    selectRandomImages() {
      let a = this.shuffleArray(this.allImages);
      let matr = a.slice(0, 24);
      this.selectedImages = matr.slice(3, 6);
      this.imageGrid = this.shuffleArray(matr);
      this.showMatrixAfterDelay();
    },
    showMatrixAfterDelay() {
      setTimeout(() => {
        this.isMatrixVisible = true;
      }, 5000); // Показываем матрицу через 5 секунд
    },
    checkImage(image) {
      if (this.selectedImages.includes(image) && !this.foundImages.includes(image)) {
        this.foundImages.push(image);
        this.right++;
      } else {
        this.wrong++;
      }

      if (this.foundImages.length === this.selectedImages.length) {
        this.isMatrixVisible = false;
        this.foundImages = [];
        this.selectRandomImages();
      }
    },
    isCorrectImage(image) {
      return this.foundImages.includes(image);
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    exitToMenu() {
      clearInterval(this.timerInterval); // Останавливаем таймер
      this.$router.push('/menu'); // Переход в меню
      this.$emit('cancel'); // Прерываем выполнение всех функций компонента
    },
  },
  async mounted() {
    await this.loadImages(); // Загружаем изображения при монтировании компонента
    this.showAlert();
    this.selectRandomImages();
  },
};
</script>

<style>
#app {
  align-items: baseline;
  text-align: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}
.grid-item {
  cursor: pointer;
  padding: auto;
}
.image {
  display: inline-block;
  margin: 10px;
}
.grid-item.selected {
  border: 1px solid blue; /* Цвет и стиль рамки */
}

.exit-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #f44336; /* Красный цвет для кнопки выхода */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.exit-button:hover {
  background-color: #d32f2f; /* Темнее красный при наведении */
}

@media (max-width: 600px) {
  img {
    max-width: 50%; /* Ограничивает ширину изображения до 100% от родительского элемента */
    height: 50%; /* Сохраняет пропорции изображения */
  }
  .image {
    display: inline-block;
    margin: 7px;
  }
  .image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
  }
  #app {
    width: 80%;
    height: 70%;
  }
  h1 {
    font-size: 18px;
  }
  h2 {
    font-size: 16px;
  }
  h3 {
    font-size: 10px;
  }
  .word-item {
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
  }
  .word-item span {
    font-size: 14px;
    margin-bottom: 2rem;
    margin: 2rem 0;
  }
  .fixerr {
    padding: 0rem;
    z-index: 1000;
  }
}
</style>