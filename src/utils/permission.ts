// 检查用户是否拥有指定权限
import { storage } from '@/utils/index'

const hasPermission = (code: string): boolean => {
  const data = storage.getSession('permissions')
  console.log('是否有权限', data.includes(code))
  return data.includes(code)
}

export { hasPermission }
