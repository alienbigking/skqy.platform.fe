// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// import { layout } from '@/layout'
import { getInitialState } from '@/initialState'
import { rootContainer } from '@/rootContainer'
// import { antd } from '@/antd'
import 'dayjs/locale/zh-cn'

export default { getInitialState, rootContainer }
