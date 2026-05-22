import React, { useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { getUrlParams } from '@/utils'
import { storage } from '@/utils'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/pages/common/stores'

// 校验是否登录
const useAuth = () => {
  const [isLoginStore, setIsLoginStore] = useRecoilState(
    commonStore.isLoginStore
  )

  useMount(() => {})

  const isLogin = Boolean(storage.getSession('token'))

  return {
    isLogin
  }
}

export { useAuth }
