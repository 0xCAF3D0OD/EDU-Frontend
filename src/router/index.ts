import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Missions from '../pages/Missions.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: Home },
        { path: 'missions', component: Missions },
        { path: 'about', component: About },
        { path: ':pathMatch(.*)*', component: NotFound },
      ],
    },
  ],
})

export default router
