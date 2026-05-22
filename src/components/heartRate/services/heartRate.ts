import { http } from '@/utils'
// import { IDemo } from '../types/demo'
export default {
  get(id: number) {
    return http(`users/${id}`).then((response) => {
      return response.data
    })
  }
}
