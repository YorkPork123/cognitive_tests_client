<template>
  <div>
    <h5 class="text-center mb-3">Введите найденные слова через запятую. Регистр не важен.</h5>
    <div
      class="bg-light p-3 mb-3 text-monospace letter-grid"
    >
      {{ letterGrid }}
    </div>
    <textarea
      class="form-control mb-3"
      placeholder="Введите найденные слова..."
      @input="$emit('update-input', $event.target.value)"
    ></textarea>
    <div class="d-flex justify-content-between">
      <button class="btn btn-warning" @click="$emit('finish-test')">Завершить</button>
      <div class="text-danger">{{ timeLeft }} секунд осталось</div>
    </div>
  </div>
</template>

  <script>
  export default {
    props: ['letterGrid', 'timeLeft']
  };
  </script>

