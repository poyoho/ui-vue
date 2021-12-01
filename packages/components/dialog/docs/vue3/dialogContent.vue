<template>
  <div class="dialog">
    <h1>{{ msg }}</h1>
    <button @click="$emit('close')">close</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue3'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true,
      default: "test"
    }
  },
})
</script>

<style scoped>
.dialog {
  background: green;
  color: #000;
}
</style>
