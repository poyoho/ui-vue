import { createRouter, createWebHistory } from 'vue-router'
import docs from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes: docs
})

export default router
