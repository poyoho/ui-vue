<script lang="ts">
import { defineComponent, ref, onMounted } from "vue3"
import { mountVue2Components, mountVue3Components } from "./mount"
export default defineComponent({
  setup () {
    const container2 = ref<HTMLHtmlElement>()
    const container3 = ref<HTMLHtmlElement>()
    const component = window.location.pathname

    onMounted(async () => {
      mountVue2Components(container2.value!, component)
      mountVue3Components(container3.value!, component)
    })

    return {
      container2,
      container3
    }
  }
})
</script>
<template>
  <div class="wrap">
    <div class="vue2">
      <p>vue2</p>
      <div class=container>
        <!-- vue2 will replace dom -->
        <div class="mount" ref="container2"></div>
      </div>
    </div>
    <div class="vue3">
      <p>vue3</p>
      <div class=container ref="container3"></div>
    </div>
  </div>
</template>
<style scoped>
.container {
  outline: 0;
  border: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
}
.wrap {
  width: 100%;
  display: flex;
  background: #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  gap: 10px;
}
.wrap .vue2 {
  flex: 1;
  border-radius: 5px;
  background: #eee;
}
.wrap .vue3 {
  flex: 1;
  border-radius: 5px;
  background: #eee;
}
p {
  padding: 0;
  margin: 0;
  text-align: center;
}
.vue2 p {
  color: #32475e;
}
.vue3 p {
  color: #3fb984;
}
</style>
