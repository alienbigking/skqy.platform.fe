import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './oauthClient.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, message, Popconfirm, Select, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { IPagination } from '@/pages/common/types/common'
import { Permission } from '@/components/permission'
import { oauthClientService } from '../services'
import OAuthClientForm from './oauthClientForm'

interface OAuthClientItem {
  id: string
  clientId: string
  clientSecret: string
  clientName: string
  type: string
  environment: string
  grants: string
  redirectUris: string
  createDate?: number
}

type FieldType = {
  clientId?: string
  clientName?: string
  type?: string
  environment?: string
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

const optionText = (options: Array<{ label: string; value: string }>, value?: string) =>
  options.find((item) => item.value === value)?.label || value || '-'

const OAuthClient: React.FC = () => {
  const [isVisibleForm, setIsVisibleForm] = useState(false)
  const [rowData, setRowData] = useState<OAuthClientItem | null>(null)
  const [tableData, setTableData] = useState<OAuthClientItem[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [form] = Form.useForm()

  const columns: ColumnsType<OAuthClientItem> = [
    {
      title: '客户端名称',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (value) => value || '-'
    },
    {
      title: '客户端ID',
      dataIndex: 'clientId',
      key: 'clientId',
      ellipsis: true,
      render: (value) => (
        <Tooltip title={value || '-'}>
          <span className={cn(styles.tableText)}>{value || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '应用类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (value) => optionText(typeOptions, value)
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      width: 100,
      render: (value) => optionText(environmentOptions, value)
    },
    {
      title: '授权类型',
      dataIndex: 'grants',
      key: 'grants',
      ellipsis: true,
      render: (value) => (
        <Tooltip title={value || '-'}>
          <span className={cn(styles.tableText)}>{value || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 180,
      render: (value) => (value ? DayJS(value).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="oauth.list.edit">
            <Button type="text" className={cn(['gGeneralTextButton'])} onClick={() => onEdit(record)}>
              编辑
            </Button>
          </Permission>
          <Permission code="oauth.list.delete">
            <Popconfirm
              title="是否确认删除？"
              description="此操作会删除当前授权客户端，您确定要删除吗？"
              onConfirm={() => onDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" className={cn(['gDeleteTextButton'])}>
                删除
              </Button>
            </Popconfirm>
          </Permission>
        </div>
      )
    }
  ]

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await oauthClientService.getList({
      ...values,
      ...pagination
    })
    setTableData(data?.list || [])
    setTotal(data?.total || 0)
  }, [form, pagination])

  const onSearch = () => {
    setPagination({
      page: 1,
      pageSize: pagination.pageSize
    })
  }

  const onReset = () => {
    form.resetFields()
    setPagination({
      page: 1,
      pageSize: 10
    })
  }

  const onChangeTable = (pagination: any) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onNew = () => {
    setRowData(null)
    setIsVisibleForm(true)
  }

  const onEdit = (record: OAuthClientItem) => {
    setRowData(record)
    setIsVisibleForm(true)
  }

  const onDelete = async (record: OAuthClientItem) => {
    const response = await oauthClientService.delete(record.id)
    if (response.status === 0) {
      message.success('删除授权客户端成功')
      getList()
    } else {
      message.error(response.message || '删除授权客户端失败')
    }
  }

  const handleOk = () => {
    setIsVisibleForm(false)
    setRowData(null)
    getList()
  }

  const handleCancel = () => {
    setIsVisibleForm(false)
    setRowData(null)
  }

  return (
    <div className={cn(styles.oauthClient)}>
      <HeaderWrapper title="授权客户端" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item<FieldType> label="客户端名称" name="clientName">
            <Input placeholder="请输入客户端名称" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="客户端ID" name="clientId">
            <Input placeholder="请输入客户端ID" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="应用类型" name="type">
            <Select placeholder="请选择应用类型" options={typeOptions} allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="环境" name="environment">
            <Select placeholder="请选择环境" options={environmentOptions} allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="oauth.list.create">
              <Button icon={<PlusOutlined />} className={cn(['gMainButton'])} type="primary" onClick={onNew}>
                新增
              </Button>
            </Permission>
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              onChange={onChangeTable}
              scroll={{ x: 'max-content' }}
              pagination={{
                total,
                current: pagination.page,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>
        <OAuthClientForm
          rowData={rowData}
          isVisible={isVisibleForm}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      </ContentWrapper>
    </div>
  )
}

export default OAuthClient
