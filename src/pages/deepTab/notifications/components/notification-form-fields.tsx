import React from 'react'
import { DatePicker, Form, Input, InputNumber, Select, Space } from 'antd'
import { statusOptions, typeOptions } from './notification-options'

interface INotificationFormFieldsProps {
  showStatus?: boolean
}

const NotificationFormFields: React.FC<INotificationFormFieldsProps> = ({ showStatus = true }) => (
  <>
    <Form.Item name="title" label="通知标题" rules={[{ required: true, message: '请输入通知标题' }]}>
      <Input placeholder="例如：DeepTab 新版本已发布" maxLength={40} showCount />
    </Form.Item>
    <Form.Item name="content" label="通知内容" rules={[{ required: true, message: '请输入通知内容' }]}>
      <Input.TextArea rows={5} placeholder="请输入要展示给 DeepTab 用户的通知内容" maxLength={300} showCount />
    </Form.Item>
    <Form.Item name="type" label="通知类型" rules={[{ required: true, message: '请选择通知类型' }]}>
      <Select options={typeOptions.filter((item) => item.value)} placeholder="请选择通知类型" />
    </Form.Item>
    {showStatus && (
      <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
        <Select options={statusOptions.filter((item) => item.value)} placeholder="请选择状态" />
      </Form.Item>
    )}
    <Form.Item name="actionText" label="按钮文案">
      <Input placeholder="例如：查看详情，可选" maxLength={16} />
    </Form.Item>
    <Form.Item name="actionUrl" label="跳转链接">
      <Input placeholder="https://..." />
    </Form.Item>
    <Space size={16} style={{ width: '100%' }} align="start">
      <Form.Item name="priority" label="优先级" style={{ width: 180 }}>
        <InputNumber min={0} max={999} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="durationSeconds" label="显示秒数" style={{ width: 180 }}>
        <InputNumber min={3} max={60} style={{ width: '100%' }} />
      </Form.Item>
    </Space>
    <Space size={16} style={{ width: '100%' }} align="start">
      <Form.Item name="startAt" label="开始时间">
        <DatePicker showTime placeholder="不填则立即生效" />
      </Form.Item>
      <Form.Item name="endAt" label="结束时间">
        <DatePicker showTime placeholder="不填则长期有效" />
      </Form.Item>
    </Space>
  </>
)

export default NotificationFormFields
