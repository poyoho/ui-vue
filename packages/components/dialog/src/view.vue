<template>
  <div class="cv-dialog">
    <div
      v-for="item in dialogState.state.stack"
      :key="item.key"
      v-bind="item.data"
    >
      <div
        v-if="item.data.bar"
        class="cv-dialog__bar"
      />
      <div class="cv-dialog__content">
        <DynamicComponent :vnode="item.component" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@ui-vue/adapter"
import { DynamicComponent } from "@ui-vue/utils"
import { injectDialogState } from "./context"

export default defineComponent({
  components: {
    DynamicComponent,
  },
  props: {
    bar: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const dialogState = injectDialogState()
    return {
      dialogState
    }
  }
})
</script>
