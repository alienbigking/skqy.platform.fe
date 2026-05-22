import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  TreeSelect
} from 'antd'
import cn from 'classnames'
import styles from './userEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import {
  accountOptions,
  genderOptions,
  isNullObject,
  phoneNumberValidator
} from '@/utils'
import { EAccountStatus } from '@/pages/common/types/common'
import { userService } from '@/pages/user/services'
import { roleService } from '@/pages/role/services'
import { commonService } from '@/pages/common/services'

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
  status?: EAccountStatus
  organizationId?: string
  roleIds?: []
}

const UserEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [organizationOptions, setOrganizationOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isNullObject(rowData) && isVisible) {
      getDetail()
      getRoleList()
      getOrganizationList()
    }
  }, [isVisible, rowData])

  const getDetail = async () => {
    const { code, data } = await userService.getDetail(rowData.id)
    console.log('获取的用户详情信息', data)
    if (code === '200') {
      handleEditData(data)
    }
  }

  const getRoleList = async () => {
    const { code, data } = await roleService.getAllList()
    if (code === '200') {
      console.log('获取所有的角色数据', data)
      setRoleOptions(data)
    }
  }

  const getOrganizationList = async () => {
    const { code, data } = await commonService.getAllOrganizationsList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const handleEditData = (values: any) => {
    const roleIds = values.roles.map((item: any) => item.id)
    form.setFieldsValue({
      ...values,
      roleIds
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await userService.update({ id: rowData.id, ...values })
    if (data.code === '200') {
      message.success('编辑用户成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onSelectState = () => {}

  const onSelectGender = () => {}

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
              label="所属机构"
              name="organizationId"
              rules={[{ required: false, message: '请选择所属机构' }]}
            >
              <TreeSelect
                placeholder="请选择所属机构"
                onChange={onSelectState}
                treeData={organizationOptions}
                allowClear
                treeDefaultExpandAll
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
              />
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
                onChange={onSelectState}
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
              <Radio.Group options={genderOptions} onChange={onSelectGender} />
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
              <Select
                placeholder="请选择账号状态"
                onChange={onSelectState}
                options={accountOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default UserEdit
