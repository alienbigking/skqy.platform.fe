import React, { memo, useEffect } from 'react'
import { Card, Form } from 'antd'
import cn from 'classnames'
import styles from './userGuide.less'
// import userGuide from '@/assets/images/userGuide.png'
import companyInfo from '@/assets/images/companyInfo.png'

const { Meta } = Card

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

const UserGuide: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [form] = Form.useForm()

  useEffect(() => {
    getInfo()
  }, [])
  const getInfo = async () => {}

  const descriptionInfo = () => (
    <div className={cn(styles.descriptionInfo)}>
      <div className={cn(styles.title)}>《乐心平江运营管理系统》软件简介</div>
      <div className={cn(styles.content)}>
        <p>
          乐心平江运营管理系统是一套面向动态心电记录仪业务打造的综合型后台运营管理平台，
          主要用于对动态心电设备、检测数据、用户信息及运营流程进行统一管理与分析，
          为心电检测业务的稳定运行与规范化管理提供系统支撑。
        </p>

        <p>
          系统围绕动态心电检测业务场景，构建了涵盖设备管理、心电数据管理、检测报告管理、
          用户与权限管理以及运营日志管理等核心功能模块，
          实现对动态心电检测全流程的集中管控与信息留存。
        </p>

        <p>
          在安全与合规方面，系统通过权限分级控制、关键操作日志记录以及数据安全防护机制，
          确保检测数据与业务操作的可追溯性与安全性，
          满足医疗信息系统对稳定性、安全性和规范性的要求。
        </p>

        <p>🧩 一、系统定位</p>
        <p>• 动态心电记录仪核心后台运营管理系统</p>
        <p>• 心电检测数据的集中管理与运营支撑平台</p>
        <p>• 面向医疗合规要求设计的业务管理系统</p>

        <p>⚙️ 二、主要功能模块</p>
        <p>
          • 设备与终端管理：动态心电记录仪设备信息管理、状态监控与使用记录追溯
        </p>
        <p>• 心电数据管理：心电检测数据集中存储、查询与留存</p>
        <p>• 检测报告管理：动态心电检测报告生成、状态管理与历史调阅</p>
        <p>• 用户与权限管理：账号信息维护与多角色权限控制</p>
        <p>• 运营与日志管理：系统访问、操作与接口日志记录</p>

        <p>🔐 三、安全与合规</p>
        <p>• 权限分级控制与角色管理机制</p>
        <p>• 关键业务与操作行为日志留存</p>
        <p>• 数据传输与存储过程安全防护</p>
        <p>• 满足医疗信息系统对安全性、稳定性与可追溯性的要求</p>

        <p>🚀 四、系统特点</p>
        <p>• 稳定可靠，支持动态心电检测业务长期稳定运行</p>
        <p>• 模块清晰，系统结构合理，便于维护与扩展</p>
        <p>• 数据完整，检测与运营数据全流程留痕</p>
        <p>• 管理高效，满足日常运营与管理需求</p>

        <p>🧩 五、应用价值</p>
        <p>• 提升动态心电检测业务的运营效率</p>
        <p>• 加强设备与检测数据的统一管理能力</p>
        <p>• 为心电检测服务提供稳定可靠的后台支撑</p>
        <p>• 为后续业务扩展与系统升级提供基础平台能力</p>
      </div>
    </div>
  )

  return (
    <div className={cn(styles.userGuide)}>
      <Card
        style={{ width: 480 }}
        cover={<img draggable={false} alt="乐心平江" src={companyInfo} />}
      >
        <Meta title="软件简介" description={descriptionInfo()} />
      </Card>
    </div>
  )
})

export default UserGuide
