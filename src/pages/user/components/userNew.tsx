import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Radio, Row, Select } from 'antd'
import cn from 'classnames'
import styles from './userNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { genderOptions, phoneNumberValidator } from '@/utils'
import { userService } from '@/pages/user/services'
import { roleService } from '@/pages/role/services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  nickname?: string
  userIdentifier?: string
  password?: string
  email?: string
  mobile?: string
  gender?: string
  status?: string
  roleIds?: string[]
  remark?: string
}

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' }
]

const UserNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [roleOptions, setRoleOptions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      getRoleList()
    }
  }, [isVisible])

  const getRoleList = async () => {
    const { status, data } = await roleService.getAllList()
    if (status === 0) {
      setRoleOptions(data || [])
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const data = await userService.add({
      ...values,
      active: values.status === 'disabled' ? 1 : 0
    })
    if (data.status === 0) {
      message.success('新增用户成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(data.message || '新增用户失败')
    }
  }

  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.userNew)}
      title="新增用户"
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
        labelCol={{ span: 4 }}
        initialValues={{ status: 'enabled', gender: '0' }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="登录账号"
              name="userIdentifier"
              rules={[{ required: true, message: '请输入登录账号' }]}
            >
              <Input placeholder="请输入用户名、邮箱或手机号" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="登录密码"
              name="password"
              rules={[{ required: true, message: '请输入登录密码' }]}
            >
              <Input.Password placeholder="请输入登录密码" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="所属角色"
              name="roleIds"
              rules={[{ required: false, message: '请选择所属角色' }]}
            >
              <Select
                placeholder="请选择所属角色"
                mode="multiple"
                options={roleOptions}
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="邮箱"
              name="email"
              rules={[{ required: false, message: '请输入邮箱' }]}
            >
              <Input placeholder="请输入邮箱" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="手机号"
              name="mobile"
              rules={[
                { required: false, message: '请输入手机号' },
                {
                  validator: phoneNumberValidator
                }
              ]}
            >
              <Input placeholder="请输入手机号" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="性别"
              name="gender"
              rules={[{ required: false, message: '请选择性别' }]}
            >
              <Radio.Group options={genderOptions} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="账号状态"
              name="status"
              rules={[{ required: false, message: '请选择账号状态' }]}
            >
              <Select placeholder="请选择账号状态" options={statusOptions} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="备注"
              name="remark"
              rules={[{ required: false, message: '请输入备注' }]}
            >
              <Input placeholder="请输入备注" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default UserNew
