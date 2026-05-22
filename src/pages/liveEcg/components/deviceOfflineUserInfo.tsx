import React, { memo, useEffect } from 'react'
import { Col, Form, Input, Modal, Row } from 'antd'
import cn from 'classnames'
import styles from './deviceOfflineUserInfo.less'
import { AdvancedButton } from '@/components/advancedButton'
import { isNullObject } from '@/utils'

interface Props {
  isVisible?: boolean
  data?: any
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  age: number
  emergencyContact: string
  emergencyContactMobile: string
  gender: number
  mobile: string
  startTime: string
  userId: string
  username: string
  address: string
}

const DeviceOfflineUserInfo: React.FC<Props> = memo((props) => {
  const { isVisible = false, data, handleOk, handleCancel } = props

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(data)) {
      handleFormData()
    }
    console.log('接收的信息', data)
  }, [isVisible, data])

  const handleFormData = () => {
    form.setFieldsValue({
      startTime: data?.content.startTime,
      username: data?.content?.username,
      mobile: data?.content?.mobile,
      emergencyContact: data?.content?.emergencyContact,
      emergencyContactMobile: data?.content?.emergencyContactMobile,
      address: data?.content?.address
    })
  }

  const onCancel = () => {
    handleCancel?.()
    console.log('点击关闭了')
  }

  return (
    <Modal
      className={cn(styles.deviceOfflineUserInfo)}
      title="离线用户个人信息"
      open={isVisible}
      width={568}
      centered
      onCancel={onCancel}
      footer={[
        <AdvancedButton
          key="cancel"
          title="取消"
          defaultProps={{
            onClick: onCancel
          }}
        />
        // <AdvancedButton
        //   key="confirm"
        //   type={EType.general}
        //   title="确认"
        //   defaultProps={{
        //     onClick: onOk
        //   }}
        // />
      ]}
    >
      <Form
        form={form}
        name="form"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        variant="filled"
        labelCol={{ span: 4 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="时间"
              name="startTime"
              rules={[{ required: true, message: '请输入时间' }]}
            >
              <Input placeholder="请输入时间" readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="名称"
              name="username"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" readOnly />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="手机号"
              name="mobile"
              rules={[{ required: false, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="紧急联系人"
              name="emergencyContact"
              rules={[{ required: false, message: '请输入紧急联系人' }]}
            >
              <Input placeholder="请输入紧急联系人" readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="联系人电话"
              name="emergencyContactMobile"
              rules={[{ required: false, message: '请输入联系人电话' }]}
            >
              <Input placeholder="请输入联系人电话" readOnly />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="联系人地址"
              name="address"
              rules={[{ required: false, message: '请输入联系人地址' }]}
            >
              <Input placeholder="请输入联系人地址" readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default DeviceOfflineUserInfo
