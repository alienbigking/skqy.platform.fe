import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './wallpapers.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import wallpapersService from '../services/wallpapers'
import type { IWallpaperRecord, WallpaperType } from '../types/wallpapers'
import type { IPagination } from '@/pages/common/types/common'

const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '精选图片', value: 'image' },
  { label: '动态壁纸', value: 'dynamic' }
]

const imageCategoryOptions = ['动物', '植物', '动漫', '街头', '自然', '其他'].map((item) => ({
  label: item,
  value: item
}))

const dynamicCategoryOptions = imageCategoryOptions
const categorySearchOptions = [{ label: '全部分类', value: '' }, ...imageCategoryOptions]

const Wallpapers: React.FC = () => {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [list, setList] = useState<IWallpaperRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState<IWallpaperRecord | null>(null)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [total, setTotal] = useState(0)
  const currentType: WallpaperType = Form.useWatch('type', editForm) || 'image'
  const currentCategoryOptions = currentType === 'dynamic' ? dynamicCategoryOptions : imageCategoryOptions

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      const { data } = await wallpapersService.getList({
        ...values,
        ...pagination
      })
      setList(data?.list || [])
      setTotal(data?.total || 0)
    } finally {
      setLoading(false)
    }
  }, [form, pagination])

  useEffect(() => {
    load()
  }, [load])

  const onSearch = () => {
    setPagination({
      page: 1,
      pageSize: pagination.pageSize
    })
  }

  const onReset = () => {
    setPagination({
      page: 1,
      pageSize: 10
    })
  }

  const onChangeTable = (nextPagination: any) => {
    setPagination({
      page: nextPagination.current,
      pageSize: nextPagination.pageSize
    })
  }

  const columns: ColumnsType<IWallpaperRecord> = [
    {
      title: '预览',
      dataIndex: 'thumbnail',
      width: 140,
      render: (value) => (
        <img
          src={value}
          alt=""
          style={{ width: 112, height: 63, borderRadius: 8, objectFit: 'cover', display: 'block' }}
        />
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (value) => <Tag color={value === 'dynamic' ? 'blue' : 'green'}>{value}</Tag>
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (value) => value || '-'
    },
    {
      title: '分类',
      dataIndex: 'category'
    },
    {
      title: '来源',
      dataIndex: 'source',
      render: (value) => value || '-'
    },
    {
      title: '排序',
      dataIndex: 'sortOrder'
    },
    {
      title: '启用',
      dataIndex: 'isActive',
      render: (value) => <Switch checked={!!value} disabled />
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      width: 180,
      render: (value) => DayJS(value).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space>
          <Permission code="deeptab.wallpaper.edit">
            <Button
              type="link"
              onClick={() => {
                setEditing(record)
                editForm.setFieldsValue({
                  ...record,
                  tags: Array.isArray(record.tags) ? record.tags.join(', ') : ''
                })
                setVisible(true)
              }}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="deeptab.wallpaper.delete">
            <Popconfirm
              title="确认删除该壁纸吗？"
              onConfirm={async () => {
                const { status } = await wallpapersService.delete(record.id)
                if (status === 0) {
                  message.success('删除成功')
                  load()
                }
              }}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Permission>
        </Space>
      )
    }
  ]

  const onSave = async () => {
    const values = await editForm.validateFields()
    const payload = {
      ...values,
      isActive: values.isActive !== false,
      tags:
        typeof values.tags === 'string'
          ? values.tags
              .split(',')
              .map((item: string) => item.trim())
              .filter(Boolean)
          : values.tags
    }
    const response = editing
      ? await wallpapersService.update(editing.id, payload)
      : await wallpapersService.add(payload)
    const { status } = response
    if (status === 0) {
      message.success(editing ? '更新成功' : '新增成功')
      setVisible(false)
      setEditing(null)
      editForm.resetFields()
      load()
    }
  }

  const onInitDefaults = async () => {
    setInitLoading(true)
    try {
      const { status, data } = await wallpapersService.initDefaults()
      if (status === 0) {
        message.success(
          `初始化成功：静态${data?.defaults?.images || 0}条，动态${data?.defaults?.dynamic || 0}条`
        )
        load()
      }
    } finally {
      setInitLoading(false)
    }
  }

  return (
    <div className={cn(styles.wallpapers)}>
      <HeaderWrapper title="壁纸管理" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="标题 / 分类 / 来源 / 作者" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="type" label="类型">
            <Select options={typeOptions} placeholder="请选择类型" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="category" label="分类">
            <Select options={categorySearchOptions} placeholder="请选择分类" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="deeptab.wallpaper.create">
              <Popconfirm
                title="确认初始化默认壁纸吗？"
                description="将同步 100+ 静态壁纸和 50+ 动态壁纸到数据库，重复执行会更新默认数据。"
                onConfirm={onInitDefaults}
              >
                <Button loading={initLoading}>初始化默认壁纸</Button>
              </Popconfirm>
            </Permission>
            <Permission code="deeptab.wallpaper.create">
              <Button
                type="primary"
                className={cn(['gMainButton'])}
                onClick={() => {
                  setEditing(null)
                  editForm.setFieldsValue({
                    type: 'image',
                    category: '其他',
                    sortOrder: 100,
                    isActive: true
                  })
                  setVisible(true)
                }}
              >
                新增壁纸
              </Button>
            </Permission>
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              onChange={onChangeTable}
              scroll={{ x: 'max-content' }}
              pagination={{
                total,
                current: pagination.page,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (currentTotal) => `总计${currentTotal}条`
              }}
            />
          </div>
        </div>

        <Modal
          open={visible}
          title={editing ? '编辑壁纸' : '新增壁纸'}
          width={760}
          onOk={onSave}
          onCancel={() => {
            setVisible(false)
            setEditing(null)
            editForm.resetFields()
          }}
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            <Form.Item name="type" label="壁纸类型" rules={[{ required: true, message: '请选择类型' }]}>
              <Select
                options={typeOptions.filter((item) => item.value)}
                placeholder="请选择壁纸类型"
                onChange={(value) => {
                  editForm.setFieldValue('category', '其他')
                }}
              />
            </Form.Item>
            <Form.Item name="title" label="标题">
              <Input />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
              <Select options={currentCategoryOptions} placeholder="请选择分类" />
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
          </Form>
        </Modal>
      </ContentWrapper>
    </div>
  )
}

export default Wallpapers
