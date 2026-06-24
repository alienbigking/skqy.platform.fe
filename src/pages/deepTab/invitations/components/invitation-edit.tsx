import React, { useEffect } from 'react'
import { Form, InputNumber, message, Modal, Select } from 'antd'
import invitationsService from '../services/invitations'
import type { IAdminInvitation } from '../types/invitations'
import { statusOptions } from './invitation-options'

interface IInvitationEditProps {
  open: boolean
  record: IAdminInvitation | null
  onCancel: () => void
  onSuccess: () => void
}

const InvitationEdit: React.FC<IInvitationEditProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        inviteeStatus: record.inviteeStatus,
        reward: record.reward
      })
    }
  }, [form, open, record])

  const onSave = async () => {
    if (!record) return
    const values = await form.validateFields()
    const { status } = await invitationsService.update(record.id, values)
    if (status === 0) {
      message.success('邀请记录已更新')
      form.resetFields()
      onSuccess()
    }
  }

  return (
    <Modal
      open={open}
      title="编辑邀请记录"
      onOk={onSave}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="inviteeStatus" label="邀请状态" rules={[{ required: true, message: '请选择状态' }]}>
          <Select options={statusOptions.filter((item) => item.value)} placeholder="请选择邀请状态" />
        </Form.Item>
        <Form.Item name="reward" label="奖励值">
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default InvitationEdit
