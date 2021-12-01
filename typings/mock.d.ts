// mock vue2 types when used vue3
declare module '@vue/composition-api' {
  export * from '@vue/composition-api/dist/vue-composition-api'
  import { VNode } from 'vue2'
  import { h as _h } from '@vue/composition-api/dist/vue-composition-api'
  type h = typeof _h & ((tag: any, data: any, children: any) => VNode)
  export const h: h
}

// mock vue3 types when used vue2
declare module 'vue3' {
  export * from 'vue3/dist/vue'
  import { h as _h, VNode } from 'vue3/dist/vue'
  type h = typeof _h & ((tag: any, data: any, children: any) => VNode)
  export const h: h
}

declare const __IS_VUE2__: boolean
declare const __IS_VUE3__: boolean
declare const __DEV__: boolean
