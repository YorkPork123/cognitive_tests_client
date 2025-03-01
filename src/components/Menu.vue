<template>
  <div class="menu">
    <h1>Выберите тест</h1>
    <div class="test-list">
      <button
        v-for="test in tests"
        :key="test.id"
        @click="goToTest(test.id)"
        class="test-button"
      >
        {{ test.title }}
      </button>
    </div>
    <!-- <div class="exam-mode">
      <label>
        <input type="checkbox" v-model="isExamMode" />
        Пройти все тесты подряд
      </label>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isExamMode: false, // Режим экзамена
      tests: [
        { id: 1, title: 'Тест Мюнстерберга', url: '/app1' },
        { id: 2, title: 'Совпадающие цифры', url: '/app2' },
        { id: 3, title: 'Скорость реакции (клик)', url: '/app3' },
        { id: 4, title: 'Тест на возраст мозга', url: '/app4' },
        { id: 5, title: 'Тест на внимательность (цвет текста и текст)', url: '/app5' },
        { id: 6, title: 'Тест Струпа (лёгкий)', url: '/app6' },
        { id: 7, title: 'Тест Струпа (сложный)', url: '/app7' },
        { id: 8, title: 'Тест квадраты (оттенки)', url: '/app8' },
        { id: 9, title: 'Тест Мюнстерберга (генерация текста)', url: '/app9' },
        { id: 10, title: 'Тест на кратковременную память', url: '/app10' },
        { id: 11, title: 'Тест на скорость печати', url: '/app11' },
        { id: 12, title: 'Тест коммуникативной установки', url: '/app12' },
        { id: 13, title: 'Тест на нахождение неправильной последовательности', url: '/app13' },
        { id: 14, title: 'Тест на избирательность внимания', url: '/app14' },
        { id: 15, title: 'Буквенный охват', url: '/app15' },
        { id: 16, title: 'Классический тест Мюнстерберга', url: '/app16' },
        { id: 17, title: 'Фланговый тест Эриксена: Тест на концентрацию и обработку информации', url: '/app17' },
        { id: 18, title: 'Тест на пространственное мышление', url: '/app18' },
        { id: 19, title: 'Сравнение чисел', url: '/app19' },
        { id: 20, title: 'Игра "Аэропорт"', url: '/app20' },
        { id: 21, title: 'Игра "Буквы и цифры"', url: '/app21' },
      ],
    };
  },
  methods: {
    goToTest(testId) {
      if (this.isExamMode) {
        // Если включён режим экзамена, сохраняем текущий тест и переходим к первому
        localStorage.setItem('currentExamTest', 1);
        localStorage.setItem('isExamMode', 1);
        this.$router.push('/app1');
      } else {
        // Иначе переходим к выбранному тесту
        this.$router.push(`/app${testId}`);
        localStorage.setItem('isExamMode', 0);
      }
      localStorage.setItem('test_id', testId);
    },
  },
};
</script>

<style scoped>
.menu {
  text-align: center;
  padding: 20px;
}

.test-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 10px;
  margin-top: 20px;
  max-width: 1400px; /* Ограничиваем максимальную ширину для удобства */
  margin-left: auto;
  margin-right: auto;
}

.test-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap; /* Запрещаем перенос текста на новую строку */
  overflow: hidden;
  text-overflow: ellipsis; /* Добавляем многоточие, если текст не помещается */
}

.exam-mode {
  margin-top: 20px;
}
</style>