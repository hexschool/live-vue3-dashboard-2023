import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/UserLogin.vue'),
  },
  // DashBoard Pages
  {
    path: '/admin',
    component: () => import('../views/AdminDashboard.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/AdminProducts.vue'),
      },
      {
        path: 'orders',
        component: () => import('../views/AdminOrders.vue'),
      },
      {
        path: 'coupons',
        component: () => import('../views/AdminCoupons.vue'),
      },
      {
        path: 'article',
        component: () => import('../views/AdminArticle.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('../views/AdminDashboard.vue'),
    children: [
      {
        path: 'articles',
        component: () => import('../views/UserArticles.vue'),
      },
      {
        path: 'article/:articleId',
        component: () => import('../views/UserArticle.vue'),
      },
      {
        path: 'cart',
        component: () => import('../views/UserCart.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('../views/UserCheckout.vue'),
      },
      {
        path: 'product/:productId',
        component: () => import('../views/UserProduct.vue'),
      },
    ],
  },
  {
    path: '/admin/:pathMatch(.*)*',
    redirect: { name: 'Login' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;
