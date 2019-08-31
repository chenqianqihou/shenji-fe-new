import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/index',
    children: [{
      path: 'index',
      component: () => import('@/views/project/index'),
      name: 'project',
      meta: {
        title: '项目管理',
        icon: 'component',
        noCache: true
      }
    },
    {
      path: 'create',
      component: () => import('@/views/project/create'),
      name: 'projectCreate',
      meta: {
        title: '新建项目',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/project/detail'),
      name: 'projectDetail',
      meta: {
        title: '项目详情',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/project/edit'),
      name: 'projectEdit',
      meta: {
        title: '编辑项目',
        noCache: true
      },
      hidden: true
    }]
  },
  {
    path: '/result',
    component: Layout,
    redirect: '/result/index',
    children: [{
      path: 'index',
      component: () => import('@/views/result/index'),
      name: 'result',
      meta: {
        title: '成果管理',
        icon: 'example',
        noCache: true
      }
    }, {
      path: 'create',
      component: () => import('@/views/result/create'),
      name: 'resultCreate',
      meta: {
        title: '新建成果',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/result/detail'),
      name: 'resultDetail',
      meta: {
        title: '成果信息',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/result/edit'),
      name: 'resultEdit',
      meta: {
        title: '编辑成果',
        noCache: true
      },
      hidden: true
    }]
  },
  {
    path: '/review',
    component: Layout,
    redirect: '/review/index',
    children: [{
      path: 'index',
      component: () => import('@/views/review/index'),
      name: 'review',
      meta: {
        title: '审核管理',
        icon: 'tab',
        noCache: true
      }
    }, {
      path: '/review/people/:id',
      component: () => import('@/views/review/people'),
      name: 'reviewPeople',
      meta: {
        title: '人员调配审核',
        noCache: true
      },
      hidden: true
    }, {
      path: '/review/result/:id',
      component: () => import('@/views/review/result'),
      name: 'reviewResult',
      meta: {
        title: '审计成果审核',
        noCache: true
      },
      hidden: true
    }]
  },
  {
    path: '/audit',
    component: Layout,
    redirect: '/audit/personnel',
    alwaysShow: true, // will always show the root menu
    name: 'Audit',
    meta: {
      title: '配置管理',
      icon: 'lock',
      noCache: true
    },
    children: [
      {
        path: 'personnel',
        component: () => import('@/views/audit/personnel/index'),
        name: 'auditPersonnel',
        meta: {
          title: '人员配置',
          noCache: true
        }
      },
      {
        path: 'personnel/create',
        component: () => import('@/views/audit/personnel/create'),
        name: 'auditPersonnelCreate',
        meta: {
          title: '新建人员',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'personnel/detail/:id',
        component: () => import('@/views/audit/personnel/detail'),
        name: 'auditPersonnelDetail',
        meta: {
          title: '人员信息',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'personnel/edit/:id',
        component: () => import('@/views/audit/personnel/edit'),
        name: 'auditPersonnelEdit',
        meta: {
          title: '编辑人员',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'agency',
        component: () => import('@/views/audit/agency/index'),
        name: 'auditAgency',
        meta: {
          title: '机构配置',
          noCache: true
        }
      },
      {
        path: 'agency/create',
        component: () => import('@/views/audit/agency/create'),
        name: 'auditAgencyCreate',
        meta: {
          title: '新建机构',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'agency/detail/:id',
        component: () => import('@/views/audit/agency/detail'),
        name: 'auditAgencyDetail',
        meta: {
          title: '机构信息',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'agency/edit/:id',
        component: () => import('@/views/audit/agency/edit'),
        name: 'auditAgencyEdit',
        meta: {
          title: '编辑机构',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'objective-score',
        component: () => import('@/views/audit/objective-score/index'),
        name: 'auditobjectiveScore',
        meta: {
          title: '客观分数配置',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
