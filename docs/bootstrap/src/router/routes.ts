import Noop from '../layout/noop/noop.vue'
import Basic from '../layout/basic/basic.vue'
import { RouteRecordRaw } from 'vue-router'

const SCAN_PATH_SUFFIX = '.md'

export function generatorRoutes () {
  const pages = import.meta.glob('../../../../packages/**/*.md')

  // 文档路由
  const genRoutes = Object.keys(pages).reduce((prev, next) => {
    let prevRoute = '/'
    const page = next
      .replace('/docs/readme.md', '.md')
      .replace('../../../../packages/', '')
      .split('/')

    page.reduce((routes, nextPage) => {
      prevRoute += nextPage + '/'
      if (nextPage.endsWith(SCAN_PATH_SUFFIX)) {
        routes.push({
          name: nextPage.replace(SCAN_PATH_SUFFIX, ''),
          path: prevRoute.replace(SCAN_PATH_SUFFIX, ''),
          component: pages[next]
        })
        return []
      }
      const route = routes.find(route => route.name === nextPage)
      if (!route) {
        const children = [] as RouteRecordRaw[]
        routes.push({
          name: nextPage,
          path: prevRoute,
          component: Noop,
          children
        })
        return children
      }
      return route.children || []
    }, prev)

    return prev
  }, [] as RouteRecordRaw[])
  console.log(genRoutes)

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      props: {
        routes: genRoutes
      },
      component: Basic as any,
      children: genRoutes
    }
  ]

  return routes
}

export default generatorRoutes()
