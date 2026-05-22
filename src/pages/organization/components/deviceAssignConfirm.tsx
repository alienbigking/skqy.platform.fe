import React, { memo, useEffect, useState } from 'react'
import { Col, Form, InputNumber, message, Modal, Row, Select } from 'antd'
import cn from 'classnames'
import styles from './deviceAssignConfirm.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { organizationService } from '@/pages/organization/services'
import { productManagementService } from '@/pages/productManagement/services'
import { productCategoryIdentifier } from '@/constants'
import { useRecoilValue } from 'recoil'
import { organizationStore } from '@/pages/organization/stores'

interface Props {
  rowData?: any
  selectedRowKeys?: React.Key[]
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  productId?: string
  serviceCount?: number
}

const DeviceAssignConfirm: React.FC<Props> = memo((props) => {
  const {
    isVisible = false,
    handleOk,
    handleCancel,
    rowData,
    selectedRowKeys
  } = props
  const [productList, setProductList] = useState([])
  const rowDataStore = useRecoilValue(organizationStore.rowDataStore)

  const [form] = Form.useForm()

  useEffect(() => {
    console.log('当前是否显示', isVisible)
    if (isVisible) {
      // handleEditData(rowData)
      getProductList()
    }
  }, [isVisible])

  const getProductList = async () => {
    const { code, data } = await productManagementService.getList({
      categoryCodes: [
        // productCategoryIdentifier.dynamicAssessment,
        productCategoryIdentifier.digitalRightPackage
      ].toString()
    })
    console.log('获取的产品列表', data)

    if (code === '200') {
      setProductList(data.list)
    }
  }

  const handleEditData = (values: any) => {
    form.setFieldsValue({
      organizationName: values.name,
      reportQuota: values.reportQuota
    })
  }
  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', rowDataStore, values)
    const { code, data, msg } = await organizationService.batchAddAssignDevice({
      ...values,
      organizationId: rowDataStore.id,
      deviceIdList: selectedRowKeys
    })

    if (code === '200') {
      message.success('设备及权益分配成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(msg)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onChangeNumber = () => {
    console.log('number')
  }

  return (
    <Modal
      className={cn(styles.deviceAssignConfirm)}
      title="确认配置设备权益"
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
          <Col span={24}>
            <Form.Item<FieldType>
              label="报告服务次数"
              name="serviceCount"
              rules={[{ required: true, message: '请输入报告服务次数' }]}
            >
              <InputNumber
                placeholder="请输入报告服务次数"
                style={{ width: 240 }}
                min={0}
                onChange={onChangeNumber}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default DeviceAssignConfirm
