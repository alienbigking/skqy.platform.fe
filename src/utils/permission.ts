// 检查用户是否拥有指定权限
import { storage } from '@/utils/index'

const hasPermission = (code: string): boolean => {
  const data = storage.getSession('permissions') || []
  const userInfo = storage.getSession('userInfo') || {}
  return userInfo.isSuperAdmin || data.length === 0 || data.includes(code)
}

export { hasPermission }
