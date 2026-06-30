import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './email.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, message, Modal, Popconfirm, Select, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { SendOutlined } from '@ant-design/icons'
import { IPagination } from '@/pages/common/types/common'
import { emailService } from '../services'
import EmailSend from './emailSend'
import { Permission } from '@/components/permission'

interface Props {}

type FieldType = {
  to?: string
  subject?: string
  sendStatus?: string
}

interface EmailItem {
  id: string
  to: string
  subject: string
  text?: string
  html?: string
  region?: string
  sendStatus?: string
  messageId?: string
  errorMessage?: string
  createDate?: number
}

const statusOptions = [
  { label: '发送中', value: 'pending' },
  { label: '发送成功', value: 'success' },
  { label: '发送失败', value: 'failed' }
]

const statusColorMap: Record<string, string> = {
  pending: 'processing',
  success: 'success',
  failed: 'error'
}

const statusTextMap: Record<string, string> = {
  pending: '发送中',
  success: '发送成功',
  failed: '发送失败'
}

const Email: React.FC<Props> = () => {
  const [isVisibleSend, setIsVisibleSend] = useState(false)
  const [isVisibleDetail, setIsVisibleDetail] = useState(false)
  const [rowData, setRowData] = useState<EmailItem | null>(null)
  const [tableData, setTableData] = useState<EmailItem[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [form] = Form.useForm()

  const columns: ColumnsType<EmailItem> = [
    {
      title: '收件人',
      dataIndex: 'to',
      key: 'to',
      render: (value) => value || '-'
    },
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="top" title={value || '-'}>
          <span className={cn(styles.tableText)}>{value || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 100,
      render: (value) => (value === 'global' ? '海外' : '国内')
    },
    {
      title: '状态',
      dataIndex: 'sendStatus',
      key: 'sendStatus',
      width: 120,
      render: (value) => <Tag color={statusColorMap[value] || 'default'}>{statusTextMap[value] || '-'}</Tag>
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="top" title={value || '-'}>
          <span className={cn(styles.tableText)}>{value || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '发送时间',
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
          <Button type="text" className={cn(['gGeneralTextButton'])} onClick={() => onDetail(record)}>
            详情
          </Button>
          <Permission code="email.list.delete">
            <Popconfirm
              title="是否确认删除？"
              description="此操作会删除当前邮件记录，您确定要删除吗？"
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
    const { data } = await emailService.getList({
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

  const onDelete = async (record: EmailItem) => {
    const response = await emailService.delete(record.id)
    if (response.status === 0) {
      message.success('删除邮件记录成功')
      getList()
    } else {
      message.error(response.message || '删除邮件记录失败')
    }
  }

  const onDetail = async (record: EmailItem) => {
    const { status, data } = await emailService.getDetail(record.id)
    if (status === 0) {
      setRowData(data)
      setIsVisibleDetail(true)
    }
  }

  const handleOk = () => {
    setIsVisibleSend(false)
    getList()
  }

  return (
    <div className={cn(styles.email)}>
      <HeaderWrapper title="邮件管理" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item<FieldType> label="收件人" name="to">
            <Input placeholder="请输入收件人" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="主题" name="subject">
            <Input placeholder="请输入主题" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="状态" name="sendStatus">
            <Select placeholder="请选择状态" options={statusOptions} allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="email.list.send">
              <Button icon={<SendOutlined />} className={cn(['gMainButton'])} type="primary" onClick={() => setIsVisibleSend(true)}>
                发送邮件
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
        <EmailSend isVisible={isVisibleSend} handleOk={handleOk} handleCancel={() => setIsVisibleSend(false)} />
        <Modal
          title="邮件详情"
          open={isVisibleDetail}
          width={720}
          centered
          footer={null}
          onCancel={() => setIsVisibleDetail(false)}
        >
          <p>收件人：{rowData?.to || '-'}</p>
          <p>主题：{rowData?.subject || '-'}</p>
          <p>状态：{rowData?.sendStatus ? statusTextMap[rowData.sendStatus] : '-'}</p>
          <p>文本内容：</p>
          <Input.TextArea value={rowData?.text || ''} rows={5} readOnly />
          <p style={{ marginTop: 16 }}>HTML 内容：</p>
          <Input.TextArea value={rowData?.html || ''} rows={5} readOnly />
        </Modal>
      </ContentWrapper>
    </div>
  )
}

export default Email
