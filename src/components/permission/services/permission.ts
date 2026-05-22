import { http } from '@/utils'
// import { IDemo } from '../types/demo'
export default {
  get(id: number) {
    return http(`users/${id}`).then((response) => {
      return response.data
    })
  }
  // getFile(params) {
  //   const params = { attachment: false, username: avatar }
  //   const responseType = 'blob'
  //   return request(`users/by-username/avatar`, {
  //     params: params,
  //     responseType: responseType
  //   })
  // }
  // add(params) {
  //   return request('users', user)
  // },
  // update(params) {
  //   return request(`users/${user.id}`, user)
  // },
  // delete(id: number) {
  //   return request(`users/${id}`)
  // }
}
