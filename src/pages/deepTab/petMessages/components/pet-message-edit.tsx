import React, { useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import petMessagesService from '../services/petMessages'
import type { IDeepTabPetMessage } from '../types/petMessages'
import PetMessageFormFields from './pet-message-form-fields'

const PetMessageEdit: React.FC<{
  open: boolean
  record: IDeepTabPetMessage | null
  onCancel: () => void
  onSuccess: () => void
}> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (open && record) form.setFieldsValue(record)
  }, [form, open, record])
  const save = async () => {
    if (!record) return
    const values = await form.validateFields()
    const { status } = await petMessagesService.update(record.id, values)
    if (status === 0) {
      message.success('保存成功')
      onSuccess()
    }
  }
  return (
    <Modal
      open={open}
      title="编辑宠物语录"
      width={680}
      onOk={save}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <PetMessageFormFields />
      </Form>
    </Modal>
  )
}

export default PetMessageEdit
