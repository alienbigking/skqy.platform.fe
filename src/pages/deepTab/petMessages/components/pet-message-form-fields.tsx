import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import {
  categoryOptions,
  languageOptions,
  statusOptions
} from './pet-message-options'

const PetMessageFormFields: React.FC<{ showStatus?: boolean }> = ({
  showStatus = true
}) => (
  <>
    <Form.Item
      name="content"
      label="语录内容"
      rules={[{ required: true, message: '请输入语录内容' }]}
    >
      <Input.TextArea
        rows={4}
        maxLength={300}
        showCount
        placeholder="请输入宠物展示的简短内容"
      />
    </Form.Item>
    <Form.Item
      name="language"
      label="语言"
      rules={[{ required: true, message: '请选择语言' }]}
    >
      <Select options={languageOptions} placeholder="请选择语言" />
    </Form.Item>
    <Form.Item
      name="category"
      label="分类"
      rules={[{ required: true, message: '请选择分类' }]}
    >
      <Select options={categoryOptions} placeholder="请选择分类" />
    </Form.Item>
    {showStatus && (
      <Form.Item name="status" label="状态">
        <Select options={statusOptions} />
      </Form.Item>
    )}
    <Form.Item name="priority" label="优先级">
      <InputNumber min={0} max={4} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="durationSeconds" label="显示秒数">
      <InputNumber min={3} max={30} style={{ width: '100%' }} />
    </Form.Item>
  </>
)

export default PetMessageFormFields
