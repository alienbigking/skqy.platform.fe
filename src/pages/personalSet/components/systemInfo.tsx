import React, { memo, useEffect } from 'react'
import { Card, Form } from 'antd'
import cn from 'classnames'
import styles from './systemInfo.less'
import companyInfo from '@/assets/images/companyInfo.png'

const { Meta } = Card

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

const SystemInfo: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [form] = Form.useForm()

  useEffect(() => {
    getInfo()
  }, [])
  const getInfo = async () => {}

  return (
    <div className={cn(styles.systemInfo)}>
      <Card
        style={{ width: 480 }}
        cover={<img draggable={false} alt="乐心平江" src={companyInfo} />}
      >
        <Meta
          title="公司名称"
          description="深圳市乐心平江科技有限公司"
          style={{ marginBottom: 20 }}
        />
        <Meta
          title="产品名称"
          description="心电工作站"
          style={{ marginBottom: 20 }}
        />
        <Meta title="软件版本号" description="1.0.0" />
      </Card>
    </div>
  )
})

export default SystemInfo
