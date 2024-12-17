import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView
    },
    {
      path:'/video',
      name:'video',
      component:()=>import('@/views/detail/VideoDetail.vue')
    },
    {
      path:'/demo',
      children:[
        {
          path:'',
          name:'demo',
          component:()=>import('@/views/DemoView.vue'),
        },
        {
          path:'three',
          children:[
            {
              path:'',
              name:'three-demo1',
              component:()=>import('@/components/demo/three/demo1.vue'),
            },
            {
              path:'demo2',
              name:'three-demo2',
              component:()=>import('@/components/demo/three/demo2.vue'),
            },
            {
              path:'demo3',
              name:'three-demo3',
              component:()=>import('@/components/demo/three/demo3.vue'),
            },
            {
              path:'demo4',
              name:'three-demo4',
              component:()=>import('@/components/demo/three/demo4.vue'),
            },
            {
              path:'demo5',
              name:'three-demo5',
              component:()=>import('@/components/demo/three/demo5.vue'),
            },
            {
              path:'demo6',
              name:'three-demo6',
              component:()=>import('@/components/demo/three/demo6.vue'),
            },
            {
              path:'demo7',
              name:'three-demo7',
              component:()=>import('@/components/demo/three/demo7.vue'),
            },
            {
              path:'demo8',
              name:'three-demo8',
              component:()=>import('@/components/demo/three/demo8.vue'),
            },
            {
              path:'demo9',
              name:'three-demo9',
              component:()=>import('@/components/demo/three/demo9/scene.vue'),
            },
            {
              path:'demo10',
              name:'three-demo10',
              component:()=>import('@/components/demo/three/demo10/index.vue'),
            },
          ]
        },
        {
          path:'echart',
          children:[
            {
              path:'',
              name:'demo-echart',
              component:()=>import('@/components/demo/echart.vue'),
            },
            {
              path:'AreaClassification',
              name:'AreaClassification',
              component:()=>import('@/components/demo/echart/AreaClassification.vue')
            },
            {
              path:'RippleEffect',
              name:'RippleEffect',
              component:()=>import('@/components/demo/echart/RippleEffect.vue')
            },
            {
              path:'RelationTree',
              name:'RelationTree',
              component:()=>import('@/components/demo/echart/RelationTree.vue')
            },
            {
              path:'HeatMap',
              name:'HeatMap',
              component:()=>import('@/components/demo/echart/HeatMap.vue')
            }
          ]
        },
        {
          path:'video',
          name:'demo-video',
          component:()=>import('@/components/demo/video.vue')
        },
        {
          path:'videotest',
          name:'demo-video-test',
          component:()=>import('@/components/demo/video.vue')
        },
        {
          path:'videotype',
          name:'demo-video-type',
          component:()=>import('@/components/demo/type.vue')
        },
        {
          path:'videojsx',
          name:'demo-video-jsx',
          component:()=>import('@/components/demo/jsx.vue')
        },
        {
          path:'flex',
          name:'flex',
          component:()=>import('@/components/demo/flex.vue')
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
