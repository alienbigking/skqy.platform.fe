import React, { useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import wallpapersService from '../services/wallpapers'
import type { IWallpaperRecord } from '../types/wallpapers'
import WallpaperFormFields from './wallpaper-form-fields'

interface IWallpaperEditProps {
  open: boolean
  record: IWallpaperRecord | null
  onCancel: () => void
  onSuccess: () => void
}

const normalizePayload = (values: any) => ({
  ...values,
  isActive: values.isActive !== false,
  tags:
    typeof values.tags === 'string'
      ? values.tags
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
      : values.tags
})

const WallpaperEdit: React.FC<IWallpaperEditProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        ...record,
        tags: Array.isArray(record.tags) ? record.tags.join(', ') : ''
      })
    }
  }, [form, open, record])

  const onSave = async () => {
    if (!record) return
    const values = await form.validateFields()
    const { status } = await wallpapersService.update(record.id, normalizePayload(values))
    if (status === 0) {
      message.success('更新成功')
      form.resetFields()
      onSuccess()
    }
  }

  return (
    <Modal
      open={open}
      title="编辑壁纸"
      width={760}
      onOk={onSave}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <WallpaperFormFields form={form} />
      </Form>
    </Modal>
  )
}

export default WallpaperEdit
