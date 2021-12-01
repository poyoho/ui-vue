declare module '*.vue' {
  import { defineComponent } from '@ui-vue/adapter'
  const component: ReturnType<typeof defineComponent>
  export default component
}
