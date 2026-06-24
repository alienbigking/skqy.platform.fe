import React, { useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import notificationsService from '../services/notifications'
import NotificationFormFields from './notification-form-fields'

interface INotificationCreateProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}

const toTimestamp = (value: any) => (value?.valueOf ? value.valueOf() : 0)

const NotificationCreate: React.FC<INotificationCreateProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        type: 'info',
        priority: 0,
        durationSeconds: 10
      })
    }
  }, [form, open])

  const onSave = async () => {
    const values = await form.validateFields()
    const { status } = await notificationsService.add({
      ...values,
      status: 'draft',
      startAt: toTimestamp(values.startAt),
      endAt: toTimestamp(values.endAt)
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
      title="新增通知"
      width={760}
      onOk={onSave}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <NotificationFormFields showStatus={false} />
      </Form>
    </Modal>
  )
}

export default NotificationCreate
