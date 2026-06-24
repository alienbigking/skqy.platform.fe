import React, { useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import DayJS from 'dayjs'
import notificationsService from '../services/notifications'
import type { IDeepTabNotification } from '../types/notifications'
import NotificationFormFields from './notification-form-fields'

interface INotificationEditProps {
  open: boolean
  record: IDeepTabNotification | null
  onCancel: () => void
  onSuccess: () => void
}

const toDateValue = (value?: number) => (value ? DayJS(value) : undefined)
const toTimestamp = (value: any) => (value?.valueOf ? value.valueOf() : 0)

const NotificationEdit: React.FC<INotificationEditProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        ...record,
        startAt: toDateValue(record.startAt),
        endAt: toDateValue(record.endAt)
      })
    }
  }, [form, open, record])

  const onSave = async () => {
    if (!record) return
    const values = await form.validateFields()
    const { status } = await notificationsService.update(record.id, {
      ...values,
      startAt: toTimestamp(values.startAt),
      endAt: toTimestamp(values.endAt)
    })
    if (status === 0) {
      message.success('更新成功')
      form.resetFields()
      onSuccess()
    }
  }

  return (
    <Modal
      open={open}
      title="编辑通知"
      width={760}
      onOk={onSave}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <NotificationFormFields />
      </Form>
    </Modal>
  )
}

export default NotificationEdit
