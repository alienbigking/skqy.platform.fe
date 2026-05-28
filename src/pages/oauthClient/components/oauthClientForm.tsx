import React, { memo, useEffect } from 'react'
import { Col, Form, Input, message, Modal, Row, Select } from 'antd'
import { oauthClientService } from '../services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  clientName?: string
  type?: string
  environment?: string
  grants?: string
  redirectUris?: string
  clientSecret?: string
}

const typeOptions = [
  { label: 'Web 应用', value: 'webapp' },
  { label: 'App', value: 'app' },
  { label: '小程序', value: 'miniprogram' }
]

const environmentOptions = [
  { label: '生产', value: 'prod' },
  { label: '开发', value: 'dev' },
  { label: '测试', value: 'test' }
]

const OAuthClientForm: React.FC<Props> = memo((props) => {
  const { rowData, isVisible = false, handleOk, handleCancel } = props
  const [form] = Form.useForm()
  const isEdit = !!rowData?.id

  useEffect(() => {
    if (isVisible && isEdit) {
      getDetail()
    }
  }, [isVisible, rowData])

  const getDetail = async () => {
    const { status, data } = await oauthClientService.getDetail(rowData.id)
    if (status === 0) {
      form.setFieldsValue(data)
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const response = isEdit
      ? await oauthClientService.update(rowData.id, values)
      : await oauthClientService.add(values)

    if (response.status === 0) {
      message.success(isEdit ? '编辑授权客户端成功' : '新增授权客户端成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(response.message || '保存授权客户端失败')
    }
  }

  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      title={isEdit ? '编辑授权客户端' : '新增授权客户端'}
      open={isVisible}
      width={680}
      centered
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        name="oauthClientForm"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        labelCol={{ span: 5 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="客户端名称"
              name="clientName"
              rules={[{ required: true, message: '请输入客户端名称' }]}
            >
              <Input placeholder="请输入客户端名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="应用类型"
              name="type"
              rules={[{ required: true, message: '请选择应用类型' }]}
            >
              <Select placeholder="请选择应用类型" options={typeOptions} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="环境"
              name="environment"
              rules={[{ required: true, message: '请选择环境' }]}
            >
              <Select placeholder="请选择环境" options={environmentOptions} />
            </Form.Item>
          </Col>
          {isEdit && (
            <Col span={24}>
              <Form.Item<FieldType> label="客户端密钥" name="clientSecret">
                <Input placeholder="不填则保持原密钥" />
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item<FieldType>
              label="授权类型"
              name="grants"
              rules={[{ required: true, message: '请输入授权类型' }]}
            >
              <Input placeholder="例如 password,refresh_token" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="重定向URI"
              name="redirectUris"
              rules={[{ required: true, message: '请输入重定向URI' }]}
            >
              <Input.TextArea rows={3} placeholder="多个地址可用英文逗号分隔" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default OAuthClientForm
