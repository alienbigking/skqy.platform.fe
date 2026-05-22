const IDLE_ACTIVITY_LAST_ACTIVE_AT_KEY = '__idle_last_active_at__'
const IDLE_ACTIVITY_LOGOUT_EVENT_KEY = '__idle_logout_event__'
const IDLE_ACTIVITY_CHANNEL_NAME = '__idle_activity_channel__'
const IDLE_ACTIVITY_EVENT_NAME = '__idle_activity_event__'

type IdleActivityMessage =
  | {
      type: 'activity'
      at: number
    }
  | {
      type: 'logout'
      at: number
      reason: string
    }

let broadcastChannel: BroadcastChannel | null = null

const getBroadcastChannel = () => {
  if (broadcastChannel) {
    return broadcastChannel
  }

  if (typeof BroadcastChannel === 'undefined') {
    return null
  }

  broadcastChannel = new BroadcastChannel(IDLE_ACTIVITY_CHANNEL_NAME)
  return broadcastChannel
}

const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    return
  }
}

const safeGetLocalStorage = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

export const readLastActiveAt = () => {
  const raw = safeGetLocalStorage(IDLE_ACTIVITY_LAST_ACTIVE_AT_KEY)
  if (!raw) {
    return null
  }
  const at = Number(raw)
  if (!Number.isFinite(at)) {
    return null
  }
  return at
}

export const emitIdleActivity = (at = Date.now()) => {
  safeSetLocalStorage(IDLE_ACTIVITY_LAST_ACTIVE_AT_KEY, String(at))
  const channel = getBroadcastChannel()
  channel?.postMessage({ type: 'activity', at } as IdleActivityMessage)

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(IDLE_ACTIVITY_EVENT_NAME, {
          detail: { at }
        })
      )
    }
  } catch (e) {
    return
  }
}

export const emitIdleLogout = (reason: string, at = Date.now()) => {
  safeSetLocalStorage(
    IDLE_ACTIVITY_LOGOUT_EVENT_KEY,
    JSON.stringify({ at, reason })
  )
  const channel = getBroadcastChannel()
  channel?.postMessage({ type: 'logout', at, reason } as IdleActivityMessage)
}

export const getIdleActivityStorageKeys = () => {
  return {
    IDLE_ACTIVITY_LAST_ACTIVE_AT_KEY,
    IDLE_ACTIVITY_LOGOUT_EVENT_KEY
  }
}

export const getIdleActivityEventName = () => {
  return IDLE_ACTIVITY_EVENT_NAME
}

export const getIdleBroadcastChannel = () => {
  return getBroadcastChannel()
}
