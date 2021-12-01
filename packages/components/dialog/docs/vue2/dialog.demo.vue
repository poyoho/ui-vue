<template>
<div class="dialog">
  <button @click="open1">open1</button>
  <button @click="open2">open2</button>
</div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import Content from './dialogContent.vue'
import { createDialog } from '@lib2/components'
import '@lib2/components/dialog/style/css'

export default defineComponent({
  setup () {
    const dialog1 = createDialog(Content, {
      props: {
        msg: 'hello world dialog1',
      },
      on: {
        close() {
          dialog1.close()
        }
      }
    })
    const dialog2 = createDialog(Content, {
      props: {
        msg: 'hello world dialog2',
      },
      on: {
        close() {
          dialog2.close()
        }
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
