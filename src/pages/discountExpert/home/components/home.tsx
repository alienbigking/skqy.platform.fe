import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Switch, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { homeService } from '@/pages/discountExpert/home/services'
import { IHomeEntry } from '@/pages/discountExpert/home/types/home'

const Home: React.FC = () => {
  const [form] = Form.useForm()
  const [list, setList] = useState<IHomeEntry[]>([])
  const [editing, setEditing] = useState<IHomeEntry | null>(null)
  const [visible, setVisible] = useState(false)

  const load = async () => {
    const res = await homeService.getList({ page: 1, pageSize: 100 })
    setList(res?.data?.list || [])
  }

  useEffect(() => {
    load()
  }, [])

  const onSave = async () => {
    const values = await form.validateFields()
    if (editing) {
      const res = await homeService.update({ id: editing.id, ...values })
      if (res.data?.status === 0) {
        message.success('更新成功')
      }
    } else {
      const res = await homeService.add(values)
      if (res.data?.status === 0) {
        message.success('新增成功')
      }
    }
    setVisible(false)
    setEditing(null)
    form.resetFields()
    load()
  }

  const columns: ColumnsType<IHomeEntry> = [
    { title: '平台', dataIndex: 'platformName' },
    { title: '标题', dataIndex: 'title' },
    { title: '分类', dataIndex: 'category' },
    { title: '排序', dataIndex: 'sortOrder' },
    {
      title: '启用',
      dataIndex: 'isActive',
      render: (value) => <Switch checked={!!value} disabled />
    },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => {
            setEditing(record)
            form.setFieldsValue(record)
            setVisible(true)
          }}>编辑</Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={async () => {
              const res = await homeService.delete(record.id)
              if (res.data?.status === 0) {
                message.success('删除成功')
                load()
              }
            }}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setVisible(true)}>新增入口</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={list} />
      <Modal
        open={visible}
        title={editing ? '编辑入口' : '新增入口'}
        onOk={onSave}
        onCancel={() => {
          setVisible(false)
          setEditing(null)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="platformId" label="平台ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="platformName" label="平台名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="platformColor" label="平台颜色" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="deeplink" label="跳转地址" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Input />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Home
