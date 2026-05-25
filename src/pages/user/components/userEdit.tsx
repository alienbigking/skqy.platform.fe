import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select
} from 'antd'
import cn from 'classnames'
import styles from './userEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import {
  genderOptions,
  isNullObject,
  phoneNumberValidator
} from '@/utils'
import { userService } from '@/pages/user/services'
import { roleService } from '@/pages/role/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  nickname?: string
  email?: string
  mobile?: string
  age?: string
  gender?: string
  status?: string
  roleIds?: string[]
  remark?: string
}

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' }
]

const UserEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [roleOptions, setRoleOptions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isNullObject(rowData) && isVisible) {
      getDetail()
      getRoleList()
    }
  }, [isVisible, rowData])

  const getDetail = async () => {
    const { status, data } = await userService.getDetail(rowData.id)
    console.log('获取的用户详情信息', data)
    if (status === 0) {
      handleEditData(data)
    }
  }

  const getRoleList = async () => {
    const { status, data } = await roleService.getAllList()
    if (status === 0) {
      console.log('获取所有的角色数据', data)
      setRoleOptions(data)
    }
  }

  const handleEditData = (values: any) => {
    const roleIds = (values.roles || []).map((item: any) => item.id)
    form.setFieldsValue({
      ...values,
      roleIds
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await userService.update({ id: rowData.id, ...values })
    if (data.status === 0) {
      message.success('编辑用户成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.userEdit)}
      title="编辑用户"
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
          {/*<Col span={24}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="年龄"*/}
          {/*    name="age"*/}
          {/*    rules={[{ required: false, message: '请输入年龄' }]}*/}
          {/*  >*/}
          {/*    <InputNumber />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
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

export default UserEdit
