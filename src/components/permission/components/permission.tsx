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
    const data = storage.getSession('permissions')
    const result = data.includes(code)
    setIsPermission(result)
  }

  return <>{isPermission && children}</>
})

export default Permission
