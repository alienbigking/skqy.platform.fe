import React, { useEffect } from 'react'
import { Form, message, Modal } from 'antd'
import wallpapersService from '../services/wallpapers'
import WallpaperFormFields from './wallpaper-form-fields'

interface IWallpaperCreateProps {
  open: boolean
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

const WallpaperCreate: React.FC<IWallpaperCreateProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        type: 'image',
        category: '其他',
        sortOrder: 100,
        isActive: true
      })
    }
  }, [form, open])

  const onSave = async () => {
    const values = await form.validateFields()
    const { status } = await wallpapersService.add(normalizePayload(values))
    if (status === 0) {
      message.success('新增成功')
      form.resetFields()
      onSuccess()
    }
  }

  return (
    <Modal
      open={open}
      title="新增壁纸"
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

export default WallpaperCreate
