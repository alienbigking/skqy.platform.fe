import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select
} from 'antd'
import cn from 'classnames'
import styles from './internalBusinessNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { internalBusinessService } from '@/pages/internalBusiness/services'
import { healthReportTypeOptions } from '@/utils'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  healthReportType?: string
  typeOptions?: []
  sort?: string[]
  remark?: string
}
const InternalBusinessNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
    }
  }, [isVisible])

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    const data = await internalBusinessService.add({ ...values })

    if (data.code === '200') {
      message.success('新增内部业务成功')
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
      className={cn(styles.internalBusinessNew)}
      title="新增内部业务"
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
              label="健康报告类型"
              name="healthReportType"
              rules={[{ required: true, message: '请选择健康报告类型' }]}
            >
              <Select
                placeholder="请选择健康报告类型"
                options={healthReportTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="排序"
              name="sort"
              rules={[{ required: false, message: '请输入排序' }]}
            >
              <InputNumber
                placeholder="请输入排序"
                min={0}
                style={{ width: 120 }}
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

export default InternalBusinessNew
