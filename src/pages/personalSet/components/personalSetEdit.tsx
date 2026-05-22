import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Radio, Row } from 'antd'
import cn from 'classnames'
import styles from './personalSetEdit.less'
import { commonService } from '@/pages/common/services'
import { genderOptions } from '@/utils'
import { personalSetService } from '../services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  username?: string
  nickname?: string
  mobile?: string
  invitationCode?: string
  gender?: number
  email?: string
  remark?: string
}
const PersonalSetEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    getInfo()
  }, [])
  const getInfo = async () => {
    commonService.getUserInfo().then((res) => {
      const { code, data } = res
      console.log('用户信息', data)
      form.setFieldsValue({
        ...data
      })
    })
  }

  const onUpdate = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await personalSetService.update(rowData.id, { ...values })
    if (data.code === '200') {
      message.success('更新个人资料成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <div className={cn(styles.personalSetEdit)}>
      <div className={cn(styles.personalSetContent)}>
        <Form
          form={form}
          name="form"
          autoComplete="off"
          colon={false}
          labelAlign="right"
          labelCol={{ span: 4 }}
          variant="filled"
          rootClassName={styles.form}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item<FieldType>
                label="用户名"
                name="username"
                rules={[{ required: false, message: '请输入用户名' }]}
                layout="vertical"
              >
                <Input placeholder="用户名" readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="昵称"
                name="nickname"
                rules={[{ required: false, message: '请输入昵称' }]}
                layout="vertical"
              >
                <Input placeholder="昵称" readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="性别"
                name="gender"
                rules={[{ required: false, message: '请选择性别' }]}
                layout="vertical"
              >
                <Radio.Group options={genderOptions} disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="邀请码"
                name="invitationCode"
                rules={[{ required: false, message: '请输入邀请码' }]}
                layout="vertical"
              >
                <Input placeholder="邀请码" readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="手机号码"
                name="mobile"
                rules={[{ required: false, message: '请输入手机号码' }]}
                layout="vertical"
              >
                <Input placeholder="手机号码" readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="邮箱"
                name="email"
                rules={[{ required: false, message: '邮箱' }]}
                layout="vertical"
              >
                <Input placeholder="邮箱" readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="备注"
                name="remark"
                rules={[{ required: false, message: '请输入备注' }]}
                layout="vertical"
              >
                <Input placeholder="备注" readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/*<div className={cn(styles.actions)}>*/}
        {/*  <Button*/}
        {/*    type="primary"*/}
        {/*    onClick={onUpdate}*/}
        {/*    className={cn(['gMainButton', styles.submitBtn])}*/}
        {/*  >*/}
        {/*    更新信息*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </div>
  )
})

export default PersonalSetEdit
