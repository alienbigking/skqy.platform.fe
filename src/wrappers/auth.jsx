import { Navigate, Outlet } from '@umijs/max'
import { useAuth } from '../hooks'

export default (props) => {
  const { isLogin } = useAuth()
  if (isLogin) {
    return <Outlet />
  } else {
    return <Navigate to="/login" />
  }
}
