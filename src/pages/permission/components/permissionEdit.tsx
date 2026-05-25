import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, InputNumber, message, Modal, Row, TreeSelect } from 'antd'
import cn from 'classnames'
import styles from './permissionEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { isNullObject } from '@/utils'
import { permissionService } from '../services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  parentId?: string
  name?: string
  code?: string
  ordinal?: number
  description?: string
}

const filterSelfAndChildren = (list: any[] = [], id?: string): any[] => {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: filterSelfAndChildren(item.children || [], id)
    }))
}

const PermissionEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [permissionOptions, setPermissionOptions] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getPermissionList()
    }
  }, [rowData, isVisible])

  const getPermissionList = async () => {
    const { data } = await permissionService.getList({
      page: 1,
      pageSize: 1000
    })
    setPermissionOptions(filterSelfAndChildren(data?.list || [], rowData?.id))
  }

  const getDetail = async () => {
    const { status, data } = await permissionService.getDetail(rowData.id)
    if (status === 0) {
      form.setFieldsValue({
        ...data,
        parentId: data.parentId && data.parentId !== '0' ? data.parentId : undefined
      })
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const response = await permissionService.update(rowData.id, {
      ...values,
      parentId: values.parentId || '0'
    })

    if (response.status === 0) {
      message.success('编辑权限成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(response.message || '编辑权限失败')
    }
  }

  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      title="编辑权限"
      open={isVisible}
      width={568}
      centered
      onOk={onOk}
      onCancel={onCancel}
      className={cn(styles.permissionEdit)}
      footer={[
        <AdvancedButton
          key="cancel"
          title="取消"
          defaultProps={{ onClick: onCancel }}
        />,
        <AdvancedButton
          key="confirm"
          type={EType.general}
          title="确认"
          defaultProps={{ onClick: onOk }}
        />
      ]}
    >
      <Form
        form={form}
        name="permissionEditForm"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        labelCol={{ span: 4 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType> label="父级" name="parentId">
              <TreeSelect
                placeholder="请选择父级权限"
                treeData={permissionOptions}
                allowClear
                treeDefaultExpandAll
                fieldNames={{ label: 'name', value: 'id' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入权限名称' }]}
            >
              <Input placeholder="请输入权限名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="编码"
              name="code"
              rules={[{ required: true, message: '请输入权限编码' }]}
            >
              <Input placeholder="请输入权限编码" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> label="排序" name="ordinal">
              <InputNumber placeholder="请输入排序" min={0} style={{ width: 120 }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> label="描述" name="description">
              <Input placeholder="请输入描述" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default PermissionEdit
