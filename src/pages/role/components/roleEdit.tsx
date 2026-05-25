import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row, TreeSelect } from 'antd'
import cn from 'classnames'
import styles from './roleEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { isNullObject } from '@/utils'
import { roleService } from '@/pages/role/services'
import { permissionService } from '@/pages/permission/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  roleCode?: string
  organizationIds?: []
  permissionIds?: string[]
  remark?: string
}
const RoleEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [permissionOptions, setPermissionOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getPermissionList()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { status, data } = await roleService.getDetail(rowData.id)
    if (status === 0) {
      handleEditData(data)
    }
  }

  const getPermissionList = async () => {
    const { data } = await permissionService.getList({
      tree: true,
      page: 1,
      pageSize: 1000
    })
    setPermissionOptions(data?.list || [])
  }

  const handleEditData = (values: any) => {
    const permissionIds =
      values?.permissions?.map((item: any) => item.id) || values?.permissionIds
    const organizationIds =
      values?.organizationIds || values?.organizations?.map((item: any) => item.id)

    form.setFieldsValue({
      ...values,
      permissionIds,
      organizationIds
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const data = await roleService.update(rowData.id, { ...values })
    if (data.status === 0) {
      message.success('编辑角色成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(data.message || '编辑角色失败')
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.roleEdit)}
      title="编辑角色"
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
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="角色编码"
              name="roleCode"
              rules={[{ required: false, message: '请输入角色编码' }]}
            >
              <Input placeholder="请输入角色编码" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="关联权限"
              name="permissionIds"
              rules={[{ required: false, message: '请选择关联权限' }]}
            >
              <TreeSelect
                placeholder="请选择关联权限"
                multiple
                treeData={permissionOptions}
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
              label="备注"
              name="remark"
              rules={[{ required: false, message: '请输入备注' }]}
            >
              <Input placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default RoleEdit
