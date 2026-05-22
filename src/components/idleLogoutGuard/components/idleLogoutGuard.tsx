import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'antd'
import { history } from '@umijs/max'
import throttle from 'lodash/throttle'
import { storage } from '@/utils'
import { commonService } from '@/pages/common/services'
import {
  emitIdleActivity,
  emitIdleLogout,
  getIdleActivityEventName,
  getIdleActivityStorageKeys,
  getIdleBroadcastChannel,
  readLastActiveAt
} from '@/utils/idleActivity'

interface Props {}

const IDLE_LIMIT_MS = 30 * 60 * 1000
const WARNING_MS = 60 * 1000

const IdleLogoutGuard: React.FC<Props> = () => {
  const [isWarningVisible, setIsWarningVisible] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  const lastActiveAtRef = useRef<number>(Date.now())
  const isLoggingOutRef = useRef(false)

  useEffect(() => {
    return setupCrossTabSync()
  }, [])

  useEffect(() => {
    return setupUserActivityListeners()
  }, [])

  useEffect(() => {
    return setupIdleTimer()
  }, [])

  const setupCrossTabSync = () => {
    refreshFromStorage()
    if (!readLastActiveAt()) {
      markActive(Date.now())
    }

    const channel = getIdleBroadcastChannel()
    const onMessage = (event: MessageEvent) => {
      const data = event?.data
      if (!data || typeof data !== 'object') {
        return
      }
      if (data.type === 'activity' && typeof data.at === 'number') {
        lastActiveAtRef.current = data.at
      }
      if (data.type === 'logout' && typeof data.at === 'number') {
        doLogout('sync')
      }
    }

    if (channel) {
      channel.addEventListener('message', onMessage)
    }

    const idleActivityEventName = getIdleActivityEventName()
    const onLocalActivity = (e: Event) => {
      const customEvent = e as CustomEvent
      const at = customEvent?.detail?.at
      if (typeof at === 'number') {
        lastActiveAtRef.current = at
      }
    }
    window.addEventListener(idleActivityEventName, onLocalActivity as any)

    const { IDLE_ACTIVITY_LAST_ACTIVE_AT_KEY, IDLE_ACTIVITY_LOGOUT_EVENT_KEY } =
      getIdleActivityStorageKeys()

    const onStorage = (e: StorageEvent) => {
      if (e.key === IDLE_ACTIVITY_LAST_ACTIVE_AT_KEY) {
        refreshFromStorage()
      }
      if (e.key === IDLE_ACTIVITY_LOGOUT_EVENT_KEY) {
        doLogout('sync')
      }
    }

    window.addEventListener('storage', onStorage)

    return () => {
      if (channel) {
        channel.removeEventListener('message', onMessage)
      }
      window.removeEventListener(idleActivityEventName, onLocalActivity as any)
      window.removeEventListener('storage', onStorage)
    }
  }

  const setupUserActivityListeners = () => {
    const handler = throttle(() => {
      markActive(Date.now())
    }, 1000)

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click'
    ]

    events.forEach((evt) =>
      window.addEventListener(evt, handler, { passive: true })
    )

    const onVisibilityChange = () => {
      if (!document.hidden) {
        refreshFromStorage()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handler as any))
      document.removeEventListener('visibilitychange', onVisibilityChange)
      handler.cancel()
    }
  }

  const setupIdleTimer = () => {
    const timer = window.setInterval(() => {
      if (!hasToken()) {
        setIsWarningVisible(false)
        return
      }

      const lastActiveAt = lastActiveAtRef.current
      const now = Date.now()
      const idleMs = now - lastActiveAt
      const remainingMs = IDLE_LIMIT_MS - idleMs

      if (remainingMs <= 0) {
        setIsWarningVisible(false)
        doLogout('timeout')
        return
      }

      if (remainingMs <= WARNING_MS) {
        const seconds = Math.max(0, Math.ceil(remainingMs / 1000))
        setRemainingSeconds(seconds)
        setIsWarningVisible(true)
      } else {
        setIsWarningVisible(false)
      }
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }

  const hasToken = () => {
    const token = storage.getSession('token')
    return Boolean(token)
  }

  const clearAuthSession = () => {
    storage.setSession('userInfo', {})
    storage.setSession('permissions', [])
    storage.setSession('token', '')
    storage.setSession('defaultOpenKeys', [])
  }

  const doLogout = async (reason: string) => {
    if (isLoggingOutRef.current) {
      return
    }
    isLoggingOutRef.current = true

    if (reason !== 'sync') {
      emitIdleLogout(reason)
    }

    try {
      await commonService.loginOut()
    } catch (e) {
    } finally {
      clearAuthSession()
      setIsWarningVisible(false)
      history.push('/login')
      isLoggingOutRef.current = false
    }
  }

  const refreshFromStorage = () => {
    const at = readLastActiveAt()
    if (at) {
      lastActiveAtRef.current = at
    }
  }

  const markActive = (at = Date.now()) => {
    lastActiveAtRef.current = at
    emitIdleActivity(at)
  }

  return (
    <Modal
      open={isWarningVisible}
      closable={false}
      maskClosable={false}
      title="登录即将超时"
      centered
      footer={
        <>
          <Button onClick={() => doLogout('manual')}>退出登录</Button>
          <Button type="primary" onClick={() => markActive(Date.now())}>
            继续使用
          </Button>
        </>
      }
    >
      <div>你已长时间未操作，将在 {remainingSeconds} 秒后自动退出登录。</div>
    </Modal>
  )
}

export default IdleLogoutGuard
