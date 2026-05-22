import React, { memo } from 'react'
import { Col, Form, Input, message, Modal, Row } from 'antd'
import cn from 'classnames'
import styles from './bind.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { miniProgramUserService } from '@/pages/miniProgramUser/services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
  rowData?: any
}

type FieldType = {
  userProfile: {
    organizationId?: string
    username?: string
    nickname?: string
    birthDate?: number
    gender?: string
    mobile?: string
    height?: number
    weight?: number
  }
  sn?: string
  boxSn?: string
}
const Bind: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [form] = Form.useForm()

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)

    const { code, data, msg } = await miniProgramUserService.bind({
      ...values,
      id: rowData.id
    })

    if (code === '200') {
      message.success('绑定设备成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(msg)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.bind)}
      title="绑定设备"
      open={isVisible}
      width={568}
      centered
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <AdvancedButton
          key="cancel"
          title="取消"
          defaultProps={{
            onClick: onCancel
          }}
        />,
        <AdvancedButton
          key="confirm"
          type={EType.general}
          title="确认"
          defaultProps={{
            onClick: onOk
          }}
        />
      ]}
    >
      <Form
        form={form}
        name="form"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        labelCol={{ span: 6 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="设备SN码"
              name="sn"
              rules={[{ required: true, message: '请输入设备SN码' }]}
            >
              <Input type="number" placeholder="请输入设备SN码" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="4G网关盒SN码"
              name="boxSn"
              rules={[{ required: true, message: '请输入4G网关盒SN码' }]}
            >
              <Input type="number" placeholder="请输入4G网关盒SN码" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default Bind
