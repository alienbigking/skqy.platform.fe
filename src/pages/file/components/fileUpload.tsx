import React, { memo, useState } from 'react'
import { Form, Input, message, Modal, Upload, UploadFile, UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { fileService } from '../services'

const { Dragger } = Upload

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  describe?: string
}

const FileUpload: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [form] = Form.useForm()

  const uploadProps: UploadProps = {
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      setFileList([file])
      return false
    },
    onRemove: () => {
      setFileList([])
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const file = fileList[0]?.originFileObj || fileList[0]
    if (!file) {
      message.warning('请选择要上传的文件')
      return
    }

    const response = await fileService.upload(file as File, values.describe)
    if (response.status === 0) {
      message.success('上传文件成功')
      form.resetFields()
      setFileList([])
      handleOk?.()
    } else {
      message.error(response.message || '上传文件失败')
    }
  }

  const onCancel = () => {
    form.resetFields()
    setFileList([])
    handleCancel?.()
  }

  return (
    <Modal
      title="上传文件"
      open={isVisible}
      width={560}
      centered
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} name="fileUploadForm" colon={false} autoComplete="off">
        <Form.Item<FieldType> label="描述" name="describe">
          <Input placeholder="请输入文件描述" allowClear />
        </Form.Item>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处</p>
        </Dragger>
      </Form>
    </Modal>
  )
})

export default FileUpload
