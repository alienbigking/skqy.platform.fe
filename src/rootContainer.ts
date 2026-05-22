import React, { ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import RootWrapper from '@/wrappers/rootWrapper'

export function rootContainer(rootContainer: React.ReactNode, args: any) {
  return React.createElement(RootWrapper, null, rootContainer)
}
