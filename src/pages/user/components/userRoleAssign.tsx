import React, { memo, useEffect, useState } from 'react'
import { Form, message, Modal, Select } from 'antd'
import cn from 'classnames'
import styles from './userEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { isNullObject } from '@/utils'
import { userService } from '@/pages/user/services'
import { roleService } from '@/pages/role/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  roleIds?: string[]
}

const UserRoleAssign: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [roleOptions, setRoleOptions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isNullObject(rowData) && isVisible) {
      getRoleList()
      form.setFieldsValue({
        roleIds: (rowData.roles || []).map((item: any) => item.id)
      })
    }
  }, [form, isVisible, rowData])

  const getRoleList = async () => {
    const { status, data } = await roleService.getAllList()
    if (status === 0) {
      setRoleOptions(data || [])
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const data = await userService.update({
      id: rowData.id,
      roleIds: values.roleIds || []
    })
    if (data.status === 0) {
      message.success('分配角色成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(data.message || '分配角色失败')
    }
  }

  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.userEdit)}
      title="分配角色"
      open={isVisible}
      width={520}
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
        <Form.Item<FieldType>
          label="角色"
          name="roleIds"
          rules={[{ required: false, message: '请选择角色' }]}
        >
          <Select
            placeholder="请选择角色"
            mode="multiple"
            options={roleOptions}
            fieldNames={{
              label: 'name',
              value: 'id'
            }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default UserRoleAssign
