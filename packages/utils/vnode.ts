import { defineComponent } from '@ui-vue/adapter'

export const DynamicComponent = defineComponent({
  props: {
    vnode: [Array, String, Object, Number, Function]
  },
  setup (props) {
    const { vnode } = props
    return vnode
  }
})
