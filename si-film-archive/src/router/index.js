import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Detail from '../pages/Detail.vue'
import LearningAsset from '../pages/LearningAsset.vue'
import DashboardUser from '../pages/DashboardUser.vue'
import Upload from '../pages/Upload.vue'
import MyFilms from '../pages/MyFilms.vue'
import EditFilm from '../pages/EditFilm.vue'
import Profile from '../pages/Profile.vue'
import Collections from '../pages/Collections.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import Forgot from '../pages/auth/Forgot.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import DashboardAdmin from '../pages/admin/DashboardAdmin.vue'
import RBAC from '../pages/admin/RBAC.vue'
import Categories from '../pages/admin/Categories.vue'
import Films from '../pages/admin/Films.vue'
import Comments from '../pages/admin/Comments.vue'
import CarouselManager from '../pages/admin/CarouselManager.vue'
import Users from '../pages/admin/Users.vue'
import Uploads from '../pages/admin/Uploads.vue'
import Reports from '../pages/admin/Reports.vue'
import Analytics from '../pages/admin/Analytics.vue'
import Notifications from '../pages/admin/Notifications.vue'
import Settings from '../pages/admin/Settings.vue'
import Help from '../pages/admin/Help.vue'
import NotFound from '../pages/NotFound.vue'
import Voting from '../pages/Voting.vue'
import Privacy from '../pages/Privacy.vue'
import Terms from '../pages/Terms.vue'
import Contact from '../pages/Contact.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/detail/:id?',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/film/:filmId/asset/:assetSlug',
    name: 'LearningAsset',
    component: LearningAsset
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardUser,
    meta: { requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
    meta: { requiresAuth: true, requiresCreator: true }
  },
  {
    path: '/my-films',
    name: 'MyFilms',
    component: MyFilms,
    meta: { requiresAuth: true, requiresCreator: true }
  },
  {
    path: '/edit-film/:id',
    name: 'EditFilm',
    component: EditFilm,
    meta: { requiresAuth: true, requiresCreator: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/collections',
    name: 'Collections',
    component: Collections,
    meta: { requiresAuth: true }
  },
  {
    path: '/voting',
    name: 'Voting',
    component: Voting
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/auth/forgot',
    name: 'Forgot',
    component: Forgot,
    meta: { guestOnly: true }
  },
  {
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { guestOnly: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: DashboardAdmin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/rbac',
    name: 'RBAC',
    component: RBAC,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: Categories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/films',
    name: 'AdminFilms',
    component: Films,
    meta: { requiresAuth: true, requiresModerator: true }
  },
  {
    path: '/admin/comments',
    name: 'AdminComments',
    component: Comments,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/carousel',
    name: 'AdminCarousel',
    component: CarouselManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/uploads',
    name: 'AdminUploads',
    component: Uploads,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: Reports,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/analytics',
    name: 'AdminAnalytics',
    component: Analytics,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/notifications',
    name: 'AdminNotifications',
    component: Notifications,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: Settings,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/help',
    name: 'AdminHelp',
    component: Help,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { isLoggedIn, isAdmin, isModerator, isCreator, initialized, init } = useAuth()
  
  // Wait for auth to initialize
  if (!initialized.value) {
    await init()
  }
  
  // Check auth requirements
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  
  if (to.meta.requiresAdmin && !isAdmin.value) {
    return next({ name: 'Home' })
  }
  
  if (to.meta.requiresCreator && !isCreator.value) {
    return next({ name: 'Home' })
  }
  
  if (to.meta.requiresModerator && !isModerator.value) {
    return next({ name: 'Home' })
  }
  
  // Redirect logged in users away from guest-only pages
  if (to.meta.guestOnly && isLoggedIn.value) {
    return next({ name: 'Home' })
  }
  
  next()
})

export default router
