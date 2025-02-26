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
        { id: 1, title: 'Тест 1', url: '/app1' },
        { id: 2, title: 'Тест 2', url: '/app2' },
        { id: 3, title: 'Тест 3', url: '/app3' },
        { id: 4, title: 'Тест 4', url: '/app4' },
        { id: 5, title: 'Тест 5', url: '/app5' },
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.test-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.exam-mode {
  margin-top: 20px;
}
</style>