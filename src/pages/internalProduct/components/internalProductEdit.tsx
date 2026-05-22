import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row, Select, TreeSelect } from 'antd'
import cn from 'classnames'
import styles from './internalProductEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { isNullObject } from '@/utils'
import { commonService } from '@/pages/common/services'
import { productManagementService } from '@/pages/productManagement/services'
import { productCategoryIdentifier } from '@/constants'
import { internalProductService } from '../services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  header?: string
  organizationId?: string
  productId?: string
}

const InternalProductEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [productList, setProductList] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getOrganizationList()
      getProductList()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { code, data } = await internalProductService.getDetail(rowData.id)
    console.log('获取的机构产品详情', data)
    if (code === '200') {
      handleEditData(data)
    }
  }

  const getOrganizationList = async () => {
    const { code, data } = await commonService.getAllOrganizationsList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const getProductList = async () => {
    const { code, data } = await productManagementService.getList({
      categoryCode: productCategoryIdentifier.dynamicAssessment
    })
    console.log('获取的产品列表', data)

    if (code === '200') {
      setProductList(data.list)
    }
  }

  const handleEditData = (values: any) => {
    const organizationIds = values?.organizations?.map((item: any) => item.id)

    form.setFieldsValue({
      ...values,
      organizationIds
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await internalProductService.update(rowData.id, { ...values })
    if (data.code === '200') {
      message.success('编辑机构产品成功')
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
      title="编辑机构产品"
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
        labelCol={{ span: 6 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="业务名称"
              name="name"
              rules={[{ required: true, message: '请输入业务名称' }]}
            >
              <Input placeholder="请输入业务名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="健康报告表头"
              name="header"
              rules={[{ required: true, message: '请输入健康报告表头' }]}
            >
              <Input placeholder="请输入健康报告表头" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="关联机构"
              name="organizationId"
              rules={[{ required: true, message: '请选择关联机构' }]}
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
              label="关联产品"
              name="productId"
              rules={[{ required: true, message: '请选择关联产品' }]}
            >
              <Select
                placeholder="请选择关联产品"
                options={productList}
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default InternalProductEdit
