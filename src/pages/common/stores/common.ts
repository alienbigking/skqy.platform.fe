import { atom } from 'recoil'
import { IAnyKey } from '../types/common'

const managementServiceInfoStore = atom<IAnyKey>({
  default: {},
  key: 'managementServiceInfoStore'
})

const metricsInfoStore = atom<IAnyKey>({
  default: {},
  key: 'metricsInfoStore'
})

const isLoginStore = atom({
  default: {},
  key: 'isLoginStore'
})

const routeInfoStore = atom({
  default: {},
  key: 'routeInfoStore'
})

const isExpandMenu = atom({
  default: false,
  key: 'isExpandMenu'
})

const defaultOpenKeys = atom<string[]>({
  default: ['tmp-1'],
  key: 'defaultOpenKeys'
})

export default {
  managementServiceInfoStore,
  metricsInfoStore,
  isLoginStore,
  routeInfoStore,
  isExpandMenu,
  defaultOpenKeys
}
