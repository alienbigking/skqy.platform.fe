import { atom } from 'recoil'

const allPermission = atom<string[]>({
  default: [],
  key: 'allPermission'
})

export default { allPermission }
