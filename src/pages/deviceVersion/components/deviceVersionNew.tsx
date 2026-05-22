import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps
} from 'antd'
import cn from 'classnames'
import styles from './deviceVersionNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { deviceTypeOptions } from '@/utils'
import { InboxOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { commonService } from '@/pages/common/services'
import { deviceVersionService } from '../services'

const { Dragger } = Upload

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  files?: UploadFile[]
  name?: string
  deviceType?: string
  hardwareVersion?: string
  version?: string
  md5?: string
  description?: string
}

const DeviceVersionNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  let ecgDataOssIdRef = useRef({
    id: ''
  })
  let fileOssIdRef = useRef({
    id: ''
  })

  const uploadProps: UploadProps = {
    name: 'files',
    maxCount: 1,
    onRemove: (file) => {
      setFileList([])
    },
    beforeUpload: (file) => {
      console.log('重新上传之前的调用', file)
      ecgDataOssIdRef.current = {
        id: file.uid
      }
      setFileList([...fileList, file])

      return false
    },
    fileList
  }

  useEffect(() => {
    if (isVisible) {
    }
  }, [isVisible])

  const onOk = async () => {
    const values = await form.validateFields()
    const formData = new FormData()
    console.log('内容', values)

    setLoading(true)
    // await handleUpload()
    let file = values.files[0]
    delete values.files

    console.log('文件信息', fileList[0])
    // 添加文件
    formData.append('file', fileList[0] as RcFile)

    // 添加其他参数
    formData.append('deviceType', String(values.deviceType))
    formData.append('hardwareVersion', values.hardwareVersion)
    formData.append('version', values.version)
    formData.append('description', values.description)

    const { code, msg, data } = await deviceVersionService.add(formData)

    if (code === '200') {
      message.success('新增设备版本成功')
      form.resetFields()
      setLoading(false)

      handleOk?.()
    } else {
      message.error(msg)

      setLoading(false)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const handleUpload = async () => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('file', file as RcFile)
    })
    const { data } = await commonService.upload({ file: formData })
    console.log('文件上传成功', data)
    fileOssIdRef.current = data
  }
  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Modal
      title="新增设备版本"
      open={isVisible}
      width={568}
      centered
      onOk={onOk}
      onCancel={onCancel}
      className={cn(styles.deviceVersionNew)}
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
              label="设备类型"
              name="deviceType"
              rules={[{ required: true, message: '请选择设备类型' }]}
            >
              <Select
                placeholder="请选择设备类型"
                options={deviceTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="固件上传" required>
              <Form.Item<FieldType>
                name="files"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: '请上传固件' }]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽固件到此处</p>
                </Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="硬件版本号"
              name="hardwareVersion"
              rules={[{ required: true, message: '请输入硬件版本号' }]}
            >
              <Input placeholder="请输入硬件版本号" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="固件版本号"
              name="version"
              rules={[{ required: true, message: '请输入固件版本号' }]}
            >
              <Input placeholder="请输入固件版本号" />
            </Form.Item>
          </Col>
          {/*<Col span={24}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="md5"*/}
          {/*    name="version"*/}
          {/*    rules={[{ required: true, message: '请输入md5值' }]}*/}
          {/*  >*/}
          {/*    <Input placeholder="请输入md5值" />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={24}>
            <Form.Item<FieldType>
              label="描述"
              name="description"
              rules={[{ required: false, message: '请输入描述' }]}
            >
              <Input placeholder="请输入描述" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default DeviceVersionNew
