<template>
  <div class="wrap">
    <div class="body">
      <Menu class="menu" :route="routes"></Menu>
      <div class="main-container">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue3'
import { RouteRecordRaw } from "vue-router"
import Menu from './menu'

export default defineComponent({
  name: 'BasicLayout',
  props: {
    routes: {
      type: Object as PropType<RouteRecordRaw[]>,
      required: true,
    },
  },
  components: {
    Menu
  },
  setup (props) {
    return {
      routes: props.routes
    }
  }
})
</script>
<style scoped>
.wrap, .body {
  width: 100%;
  height: 100%;
}
.body {
  display: flex;
}
.menu {
  display: fixed;
  width: 200px;
  overflow: scroll;
  overflow-y: auto;
}
.main-container {
  width: 100%;
  padding: 10px;
  border-left: 1px solid #333;
}
</style>
