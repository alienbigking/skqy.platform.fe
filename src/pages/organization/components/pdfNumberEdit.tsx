import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  Row
} from 'antd'
import cn from 'classnames'
import styles from './organizationEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { isNullObject } from '@/utils'
import { organizationService } from '@/pages/organization/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  organizationName?: string
  reportQuota?: number
  number?: string
}

const PdfNumberEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()
  const formRef = React.createRef<FormInstance>()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      handleEditData(rowData)
    }
  }, [rowData, isVisible])

  const handleEditData = (values: any) => {
    console.log('当前行数据', rowData)
    form.setFieldsValue({
      organizationName: values.name,
      reportQuota: rowData.reportQuota
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await organizationService.reducePdfNumber({
      id: rowData.id,
      delta: values.number
    })
    if (data.code === '200') {
      message.success('减少PDF报告数量成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onChangeNumber = () => {}

  return (
    <Modal
      className={cn(styles.pdfNumberEdit)}
      title="减少PDF报告数量"
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
        ref={formRef}
        form={form}
        name="form"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        labelCol={{ span: 6 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType> label="机构名称" name="organizationName">
              <Input variant="filled" style={{ width: 240 }} disabled={true} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> label="PDF报告剩余数量" name="reportQuota">
              <Input variant="filled" style={{ width: 240 }} disabled={true} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="减少PDF报告数量"
              name="number"
              rules={[{ required: false, message: '请输入PDF报告数量' }]}
            >
              <InputNumber
                placeholder="请输入PDF报告数量"
                style={{ width: 240 }}
                min={0}
                max={rowData?.reportQuota}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default PdfNumberEdit
