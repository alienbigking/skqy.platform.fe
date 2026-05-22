import React, { ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import { IdleLogoutGuard } from '@/components/idleLogoutGuard'

const RootWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <RecoilRoot>
      <IdleLogoutGuard />
      {children}
    </RecoilRoot>
  )
}
export default RootWrapper
