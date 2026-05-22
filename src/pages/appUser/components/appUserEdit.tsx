import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Radio, Row, TreeSelect } from 'antd'
import cn from 'classnames'
import styles from './appUserEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { genderOptions, isNullObject } from '@/utils'
import { appUserService } from '../services'
import { commonService } from '@/pages/common/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  nickname?: string
  organizationIds?: []
  gender?: string
  height?: string
  weight?: string
  remark?: string
}
const AppUserEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getOrganizationList()
    }
  }, [rowData, isVisible])

  const getOrganizationList = async () => {
    const { code, data } = await commonService.getAllOrganizationsList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const getDetail = async () => {
    const { code, data } = await appUserService.getDetail(rowData.id)
    console.log('获取的用户详情', data)
    if (code === '200') {
      handleEditData(data)
    }
  }

  const handleEditData = (values: any) => {
    form.setFieldsValue({
      ...values,
      organizationIds: values.organizationId
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await appUserService.update({
      id: rowData.id,
      ...values,
      organizationId: values.organizationIds
    })
    if (data.code === '200') {
      message.success('编辑用户信息成功')
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
      className={cn(styles.roleEdit)}
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
              label="姓名"
              name="nickname"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input disabled placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="性别"
              name="gender"
              rules={[{ required: false, message: '请选择性别' }]}
            >
              <Radio.Group disabled options={genderOptions} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="身高"
              name="height"
              rules={[{ required: true, message: '请输入身高' }]}
            >
              <Input disabled placeholder="请输入身高" addonAfter="cm" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="体重"
              name="weight"
              rules={[{ required: true, message: '请输入体重' }]}
            >
              <Input disabled placeholder="请输入体重" addonAfter="kg" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="关联机构"
              name="organizationIds"
              rules={[{ required: false, message: '请选择关联机构' }]}
            >
              <TreeSelect
                placeholder="请选择关联机构"
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

export default AppUserEdit
