import React from 'react'
import { Form, Input, InputNumber, Select, Switch } from 'antd'
import type { FormInstance } from 'antd'
import type { WallpaperType } from '../types/wallpapers'
import { getCategoryOptions, typeOptions } from './wallpaper-options'

interface IWallpaperFormFieldsProps {
  form: FormInstance
}

const WallpaperFormFields: React.FC<IWallpaperFormFieldsProps> = ({ form }) => {
  const currentType: WallpaperType = Form.useWatch('type', form) || 'image'

  return (
    <>
      <Form.Item name="type" label="壁纸类型" rules={[{ required: true, message: '请选择类型' }]}>
        <Select
          options={typeOptions.filter((item) => item.value)}
          placeholder="请选择壁纸类型"
          onChange={() => {
            form.setFieldValue('category', '其他')
          }}
        />
      </Form.Item>
      <Form.Item name="title" label="标题">
        <Input />
      </Form.Item>
      <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
        <Select options={getCategoryOptions(currentType)} placeholder="请选择分类" />
      </Form.Item>
      {currentType === 'image' ? (
        <Form.Item name="url" label="图片地址" rules={[{ required: true, message: '请输入图片地址' }]}>
          <Input />
        </Form.Item>
      ) : (
        <Form.Item name="videoUrl" label="视频地址" rules={[{ required: true, message: '请输入视频地址' }]}>
          <Input />
        </Form.Item>
      )}
      <Form.Item
        name="thumbnail"
        label="缩略图地址"
        rules={currentType === 'dynamic' ? [{ required: true, message: '请输入缩略图地址' }] : []}
      >
        <Input />
      </Form.Item>
      <Form.Item name="source" label="来源">
        <Input />
      </Form.Item>
      <Form.Item name="author" label="作者">
        <Input />
      </Form.Item>
      <Form.Item name="tags" label="标签">
        <Input placeholder="多个标签用英文逗号分隔" />
      </Form.Item>
      <Form.Item name="sortOrder" label="排序">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="isActive" label="是否启用" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  )
}

export default WallpaperFormFields
