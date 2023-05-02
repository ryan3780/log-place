import { HeaderElement } from './types/header'
import { createBrowserRouter } from 'react-router-dom'
import { Router as RemixRouter } from '@remix-run/router/dist/router'
import Home from './pages/Home'
import GeneralLayout from './layout/GeneralLayout'
import Add from './pages/Add'
import Detail from './pages/Detail'



interface RouterElement {
  id: number // 페이지 아이디 (반복문용 고유값)
  path: string // 페이지 경로
  label: string // 사이드바에 표시할 페이지 이름
  element: React.ReactNode // 페이지 엘리먼트
  withHeader?: boolean // 헤더가 필요한지 여부
  includeMenu?: boolean;
}

const routerData: RouterElement[] = [
  {
    id: 0,
    path: '/',
    label: 'Home',
    element: <Home />,
    withHeader: true,
    includeMenu: true
  },
  {
    id: 1,
    path: '/add',
    label: 'add',
    element: <Add />,
    withHeader: true,
    includeMenu: true
  },
  // {
  //   id: 1,
  //   path: '/login',
  //   label: '로그인',
  //   element: <Login />,
  //   withAuth: false
  // },
  {
    id: 2,
    path: '/detail/:id',
    label: '',
    element: <Detail />,
    withHeader: true,
    includeMenu: false
  },
  // {
  //   id: 3,
  //   path: '/page-b',
  //   label: '페이지 B',
  //   element: <PageB />,
  //   withAuth: true
  // },
  // {
  //   id: 4,
  //   path: '/page-c',
  //   label: '페이지 C',
  //   element: <PageC />,
  //   withAuth: true
  // }
]

export const routers: RemixRouter = createBrowserRouter(
  // GeneralLayout 에는 페이지 컴포넌트를 children 으로 전달
  routerData.map((router) => {
    if (router.withHeader) {
      return {
        path: router.path,
        element: <GeneralLayout>{router.element}</GeneralLayout>
      }
    } else {
      return {
        path: router.path,
        element: router.element
      }
    }
  })
)

export const HeaderContent: HeaderElement[] = routerData.reduce((prev, router) => {

  console.log(prev, router)

  if (!router.withHeader) return prev

  if (!router.includeMenu) return prev

  return [
    ...prev,
    {
      id: router.id,
      path: router.path,
      label: router.label
    }
  ]
}, [] as HeaderElement[])
