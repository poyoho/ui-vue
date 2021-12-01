import { createApp, Fragment, h } from 'vue3'
import { RouterView } from 'vue-router'
import router from './router'
import runtime from './components/runtime/runtime.vue'
import { registerDialogView, DialogView } from '@lib3/components'

createApp({
  setup () {
    registerDialogView()
    return () => h(Fragment, [
      h(DialogView),
      h(RouterView),
    ])
  }
})
  .component('runtime', runtime)
  .use(router)
  .mount('#app')

