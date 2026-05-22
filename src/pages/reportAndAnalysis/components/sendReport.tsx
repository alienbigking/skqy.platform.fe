import React, { memo, useEffect } from 'react'
import { Col, Form, message, Modal, Row, Select } from 'antd'
import cn from 'classnames'
import styles from './sendReport.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { reportTypeOptions } from '@/utils'
import { reportManagementService } from '@/pages/reportManagement/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  type?: string
}
const SendReport: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
    }
  }, [isVisible])

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values, rowData)

    const { code, msg } = await reportManagementService.submit({
      id: rowData.id,
      type: values.type
    })

    if (code === '200') {
      message.success('报告已成功提交给机构')
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

  return (
    <Modal
      className={cn(styles.sendReport)}
      title="发送报告"
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
              label="报告类型"
              name="type"
              rules={[{ required: true, message: '请选择报告类型' }]}
            >
              <Select
                placeholder="请选择报告类型"
                options={reportTypeOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default SendReport
