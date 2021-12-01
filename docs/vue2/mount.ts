import Vue from 'vue2'
import VueCompositionApi from '@vue/composition-api'
import {
  registerDialogView,
  DialogView
} from '@lib2/components'

Vue.use(VueCompositionApi)

const pages = import.meta.glob('../../packages/**/docs/vue2/**/*.demo.vue')

console.groupCollapsed('vue2 support components:')
const genRoutes = Object.keys(pages).reduce((prev, next) => {
  const paths = next.split('/')
  console.log(`/${paths[3]}/${paths[4]}`)
  prev[`${paths[3]}${paths[4]}`] = pages[next]
  return prev
}, {})
console.groupEnd()

export async function mountVue2Components (container: HTMLElement, componentName: string) {
  const componentImporter = genRoutes[componentName.replace(/\/|\\/g, '')]
  const component = (await componentImporter()).default
  if (!componentImporter) {
    return
  }
  new Vue({
    setup () {
      registerDialogView()
    },
    render: (h) => h('div', [
      h(DialogView as any),
      h(component)
    ])
  }).$mount(container)
}
