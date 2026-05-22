import React, { memo, useState } from 'react'
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select
} from 'antd'
import cn from 'classnames'
import styles from './userNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { phoneNumberValidator } from '@/utils'
import { menuService } from '@/pages/menu/services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  age?: string
  sex?: string
  remember?: string
}

const UserNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [isOpen, setIsOpen] = useState(false)
  const [value1, setValue1] = useState('Apple')
  const [form] = Form.useForm()

  const sexOptions = [
    { label: '男', value: 0 },
    { label: '女', value: 1 }
  ]

  const onOk = async () => {
    const values = await form.validateFields()
    values.pid = values.pid || 0
    const data = await menuService.add({ ...values })
    if (data.code === '200') {
      message.success('新增用户成功')
      handleOk?.()
      form.resetFields()
    }
  }
  const onCancel = () => {
    handleCancel?.()
    form.resetFields()
  }

  const onSelectState = () => {}

  const onSelectSex = () => {}

  return (
    <Modal
      className={cn(styles.roleNew)}
      title="新增用户"
      open={isVisible}
      width={568}
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
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="用户名"
              name="name"
              rules={[{ required: false, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="所属机构"
              name="name"
              rules={[{ required: false, message: '请选择所属机构' }]}
            >
              <Select
                onChange={onSelectState}
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                  { value: 'disabled', label: 'Disabled', disabled: true }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="邮箱"
              name="name"
              rules={[{ required: false, message: '请输入邮箱' }]}
            >
              <Input placeholder="请输入邮箱" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="手机号"
              name="name"
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
              name="sex"
              rules={[{ required: false, message: '请选择性别' }]}
            >
              <Radio.Group
                options={sexOptions}
                onChange={onSelectSex}
                value={value1}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="年龄"
              name="age"
              rules={[{ required: false, message: '请输入年龄' }]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="账号状态"
              name="name"
              rules={[{ required: false, message: '请选择账号状态' }]}
            >
              <Select
                defaultValue="lucy"
                onChange={onSelectState}
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                  { value: 'disabled', label: 'Disabled', disabled: true }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default UserNew
