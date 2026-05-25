import React, { memo } from 'react'
import { Form, Input, message, Modal, Radio } from 'antd'
import { emailService } from '../services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  to?: string
  subject?: string
  text?: string
  html?: string
  region?: string
}

const regionOptions = [
  { label: '国内邮箱', value: 'cn' },
  { label: '海外邮箱', value: 'global' }
]

const EmailSend: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [form] = Form.useForm()

  const onOk = async () => {
    const values = await form.validateFields()
    const response = await emailService.send(values)
    if (response.status === 0) {
      message.success('邮件发送成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(response.message || '邮件发送失败')
    }
  }

  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      title="发送邮件"
      open={isVisible}
      width={680}
      centered
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        name="emailSendForm"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        labelCol={{ span: 4 }}
        initialValues={{ region: 'cn' }}
      >
        <Form.Item<FieldType>
          label="收件人"
          name="to"
          rules={[
            { required: true, message: '请输入收件人邮箱' },
            { type: 'email', message: '邮箱格式不正确' }
          ]}
        >
          <Input placeholder="请输入收件人邮箱" allowClear />
        </Form.Item>
        <Form.Item<FieldType>
          label="主题"
          name="subject"
          rules={[{ required: true, message: '请输入邮件主题' }]}
        >
          <Input placeholder="请输入邮件主题" allowClear />
        </Form.Item>
        <Form.Item<FieldType> label="区域" name="region">
          <Radio.Group options={regionOptions} />
        </Form.Item>
        <Form.Item<FieldType> label="文本内容" name="text">
          <Input.TextArea placeholder="请输入文本内容" rows={5} allowClear />
        </Form.Item>
        <Form.Item<FieldType> label="HTML内容" name="html">
          <Input.TextArea placeholder="可选，请输入 HTML 内容" rows={5} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EmailSend
