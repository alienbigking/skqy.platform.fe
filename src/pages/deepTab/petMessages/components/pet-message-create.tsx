import React, { useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import petMessagesService from '../services/petMessages'
import PetMessageFormFields from './pet-message-form-fields'

const PetMessageCreate: React.FC<{
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (open)
      form.setFieldsValue({
        language: 'zh-CN',
        category: 'encouragement',
        priority: 0,
        durationSeconds: 6
      })
  }, [form, open])
  const save = async () => {
    const values = await form.validateFields()
    const { status } = await petMessagesService.add({
      ...values,
      status: 'draft'
    })
    if (status === 0) {
      message.success('新增成功')
      form.resetFields()
      onSuccess()
    }
  }
  return (
    <Modal
      open={open}
      title="新增宠物语录"
      width={680}
      onOk={save}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <PetMessageFormFields showStatus={false} />
      </Form>
    </Modal>
  )
}

export default PetMessageCreate
