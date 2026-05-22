import React, { memo, useState } from 'react'
import { Col, Form, Input, InputNumber, Modal, Radio, Row, Select } from 'antd'
import cn from 'classnames'
import styles from './userEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { phoneNumberValidator } from '@/utils'

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

const UserEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [isOpen, setIsOpen] = useState(false)
  const [value1, setValue1] = useState('Apple')
  const [form] = Form.useForm()

  const options = [
    { label: '菜单', value: 'Apple' },
    { label: '按钮', value: 'Pear' }
  ]

  const onOk = async () => {
    const values = await form.validateFields()
    handleOk?.()
  }
  const onCancel = () => {
    handleCancel?.()
    form.resetFields()
  }

  const onSelectState = () => {}

  const onSelectSex = () => {}

  return (
    <div className={cn(styles.roleEdit)}>
      <Modal
        title="编辑用户"
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
                label="昵称"
                name="name"
                rules={[{ required: false, message: '请输入昵称' }]}
              >
                <Input placeholder="请输入昵称" allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<FieldType>
                label="所属机构"
                name="name"
                rules={[{ required: false, message: '请选择所属机构' }]}
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
                  options={options}
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
    </div>
  )
})

export default UserEdit
