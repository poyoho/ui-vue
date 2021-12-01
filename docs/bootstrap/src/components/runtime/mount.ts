import { createApp, h } from 'vue3'
import {
  registerDialogView,
  DialogView
} from '@lib3/components'

const pages = import.meta.glob('../../../../../packages/**/docs/vue3/**/*.demo.vue')
console.groupCollapsed('vue3 support components:')
const genRoutes = Object.keys(pages).reduce((prev, next) => {
  const paths = next.split('/')
  console.log(`/${paths[6]}/${paths[7]}`)
  prev[`${paths[6]}${paths[7]}`] = pages[next]
  return prev
}, {})
console.groupEnd()

export async function mountVue3Components (container: HTMLElement, componentName: string) {
  const componentImporter = genRoutes[componentName.replace(/\/|\\/g, '')]
  const component = (await componentImporter()).default
  if (!componentImporter) {
    return
  }
  createApp({
    setup () {
      registerDialogView()
      return () => h('div', [
        h(DialogView),
        h(component)
      ])
    }
  }).mount(container)
}

export async function mountVue2Components (container: HTMLElement, componentName: string) {
  // use http request to import module
  return import('@sub/mount').then((mount) => mount.mountVue2Components(container, componentName))
}
