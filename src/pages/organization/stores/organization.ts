import { atom } from 'recoil'

const rowDataStore = atom<any>({
  default: {},
  key: 'rowDataStore'
})

export default { rowDataStore }
