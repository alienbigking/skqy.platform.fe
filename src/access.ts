import { getInitialState } from './initialState'

export default () => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  const result = getInitialState()
  // console.log('权限', result)
  return {
    login: true,
    home: true
  }
}
