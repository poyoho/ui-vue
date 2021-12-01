<template>
  <button @click="open1">open1</button>
  <button @click="open2">open2</button>
</template>
<script lang="ts">
import { defineComponent } from 'vue3'
import Content from './dialogContent.vue'
import { createDialog } from '@lib3/components'
import '@lib3/components/dialog/style/css'

export default defineComponent({
  setup () {
    const dialog1 = createDialog(Content, {
      msg: 'hello world dialog1',
      onClose () {
        dialog1.close()
      }
    })
    const dialog2 = createDialog(Content, {
      msg: 'hello world dialog2',
      onClose () {
        dialog2.close()
      }
    })
    return {
      open1 () {
        dialog1.show()
      },
      open2 () {
        dialog2.show()
      }
    }
  }
})
</script>
