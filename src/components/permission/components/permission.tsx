import React, { memo, ReactNode, useEffect, useState } from 'react'
import { storage } from '@/utils'

interface Props {
  children?: ReactNode
  code?: string
}

const Permission: React.FC<Props> = memo((props) => {
  const { children, code } = props
  const [isPermission, setIsPermission] = useState<boolean>(false)

  useEffect(() => {
    hasPermission()
  }, [])

  const hasPermission = () => {
    const data = storage.getSession('permissions') || []
    const userInfo = storage.getSession('userInfo') || {}
    const result = code ? userInfo.isSuperAdmin || data.length === 0 || data.includes(code) : true
    setIsPermission(result)
  }

  return <>{isPermission && children}</>
})

export default Permission
