import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row, Select } from 'antd'
import cn from 'classnames'
import styles from './deviceManagementEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { deviceTypeOptions, isNullObject } from '@/utils'
import { deviceManagementService } from '../services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  deviceType?: string
  sn?: string
  hardwareVersion?: string
  firmwareVersion?: string
}
const DeviceManagementEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { code, data } = await deviceManagementService.getDetail(rowData.id)
    console.log('获取的设备详情', data)
    if (code === '200') {
      handleEditData(data)
    }
  }

  const handleEditData = (values: any) => {
    form.setFieldsValue({
      ...values
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await deviceManagementService.update(rowData.id, { ...values })
    if (data.code === '200') {
      message.success('编辑设备成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.warning(data.msg)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.deviceManagementEdit)}
      title="编辑设备"
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
              label="设备类型"
              name="deviceType"
              rules={[{ required: true, message: '请选择设备类型' }]}
            >
              <Select
                placeholder="请选择设备类型"
                options={deviceTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="sn码"
              name="sn"
              rules={[{ required: true, message: '请输入sn码' }]}
            >
              <Input placeholder="请输入sn码" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="硬件版本"
              name="hardwareVersion"
              rules={[{ required: false, message: '请输入硬件版本' }]}
            >
              <Input placeholder="请输入硬件版本" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="固件版本"
              name="firmwareVersion"
              rules={[{ required: false, message: '请输入固件版本' }]}
            >
              <Input placeholder="请输入固件版本" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default DeviceManagementEdit
