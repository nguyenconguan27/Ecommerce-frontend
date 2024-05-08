import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import ProductFilter from './pages/ProductFilter'
import ProductDetail from './pages/ProductDetail'
import Home from './pages/Home'
import path from './constants/path'
import LoginLayout from './layout/LoginLayout/LoginLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import { useContext } from 'react'
import { AppContext } from './context/app.context'
import UserLayout from './pages/Customer/layout/UserLayout/UserLayout'
import Profile from './pages/Customer/pages/Profile'
import HistoryPurchase from './pages/Customer/pages/HistoryPurchase'
import ChangePassword from './pages/Customer/pages/ChangePassword'
export default function useRouteElements() {
  const { isAuthenticated } = useContext(AppContext)

  function ProtectedRoute() {
    return true ? <Outlet /> : <Navigate to={path.login} />
  }

  function RejectedRoute() {
    return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
  }
  const routeElements = useRoutes([
    {
      path: path.productList,
      element: (
        <MainLayout>
          <ProductFilter />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: path.login,
      index: true,
      element: (
        <LoginLayout>
          <Login />
        </LoginLayout>
      )
    },
    {
      path: path.register,
      element: (
        <LoginLayout>
          <Register />
        </LoginLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        // {
        //   path: path.cart,
        //   element: (
        //     <CartLayout>
        //       <Cart />
        //     </CartLayout>
        //   )
        // },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    }
  ])
  return routeElements
}
