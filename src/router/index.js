import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

import LD from '../views/LandingPage.vue'

const routes = [
	{
		path: '/',
		name: 'LD',
		component: LD
	},
	{
		path: '/termofservice',
		name: 'ToS',
		component: () => import(/* webpackChunkName: "tos" */ '../views/ToS.vue')
	},
	{
		path: '/privacypolicy',
		name: 'PP',
		component: () => import(/* webpackChunkName: "pp" */ '../views/PrivacyPolicy.vue')
	},
	{
		path: '/index.html',
		redirect: { name: 'Dashboard' }
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
	},
	{
		path: '/dashboard',
		component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
		meta: {
			requiresAuth: true
		},
		children: [
			{
				path: '',
				name: 'Dashboard',
				component: () => import(/* webpackChunkName: "dashboard-child" */ '../views/Dashboard/Schedule.vue')
			},
			{
				path: '/ics',
				name: 'Icalendar',
				component: () => import(/* webpackChunkName: "dashboard-ics" */ '../views/Dashboard/Icalendar.vue')
			},
		]
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	const user = store.state.user.isLogined

	if (to.matched.some(record => record.meta.requiresAuth)) {

		if (!user) {
			next({ name: 'Login' })
		} else {
			next()
		}

	} else if (to.path == "/") {

		if (!user) {
			next()
		} else {
			next({ name: 'Dashboard' })
		}

	} else {
		next()
	}
})

export default router
