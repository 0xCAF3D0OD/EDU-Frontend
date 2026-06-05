import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Missions from '../pages/Missions.vue'
import Dashboard from '../pages/Dashboard.vue'
import Messages from '../pages/Messages.vue'
import Settings from '../pages/Settings.vue'
import Login from '../pages/Login.vue'
import CreateProfile from '../pages/CreateProfile.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Login is standalone (no nav / no footer layout)
    { path: '/login', component: Login },
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: Home },
        { path: 'missions', component: Missions },
        { path: 'dashboard', component: Dashboard },
        { path: 'messages', component: Messages },
        { path: 'settings', component: Settings },
        { path: 'create-profile', component: CreateProfile },
        { path: 'about', component: About },
        { path: ':pathMatch(.*)*', component: NotFound },
      ],
    },
  ],
})

export default router
