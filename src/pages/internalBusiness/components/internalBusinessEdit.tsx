import React, { memo, useEffect } from 'react'
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
import styles from './internalBusinessEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { healthReportTypeOptions, isNullObject } from '@/utils'
import { internalBusinessService } from '@/pages/internalBusiness/services'

interface Props {
  rowData?: any
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

const InternalBusinessEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { code, data } = await internalBusinessService.getDetail(rowData.id)
    console.log('获取的内部业务详情', data)
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
    const data = await internalBusinessService.update(rowData.id, { ...values })
    if (data.code === '200') {
      message.success('编辑内部业务成功')
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
      className={cn(styles.internalBusinessEdit)}
      title="编辑内部业务"
      open={isVisible}
      width={568}
      onOk={onOk}
      onCancel={onCancel}
      centered
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

export default InternalBusinessEdit
