import { defineComponent, computed, h, PropType, ComputedRef } from 'vue3'
import { RouteRecordRaw, useRoute, RouterLink } from 'vue-router'

function walkRoute (routes: RouteRecordRaw[], currentPath: ComputedRef<string>) {
  return routes.map(route => {
    if (route.children?.length) {
      return h(
        'div',
        {
          index: route.path,
          class: 'nav-group'
        },
        {
          default: () => {
            return [
              h('div', { class: 'nav-group__title' }, { default: () => route.name }),
              h('ul', { class: 'pure-menu-list sub-nav' }, walkRoute(route.children || [], currentPath))
            ]
          }
        }
      )
    } else {
      return h(
        'li',
        {
          index: route.path,
          class: 'nav-item'
        },
        h(
          RouterLink,
          { to: route.path, class: currentPath.value === route.path && 'active' },
          { default: () => route.name }
        )
      )
    }
  })
}

export default defineComponent({
  name: 'Route',
  props: {
    route: {
      type: Object as PropType<RouteRecordRaw[]>,
      require: true
    }
  },
  render () {
    // 选中当前激活菜单
    const route = useRoute()
    const currentPath = computed(() => route.path)

    const routes = walkRoute(this.$props.route || [], currentPath)

    return h(
      'nav',
      {
        class: 'side-nav'
      },
      {
        default: () => routes
      }
    )
  }
})
