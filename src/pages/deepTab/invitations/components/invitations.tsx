import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './invitations.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Card, Col, Form, Input, InputNumber, message, Modal, Select, Statistic, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import invitationsService from '../services/invitations'
import type { IAdminInvitation } from '../types/invitations'
import type { IPagination } from '@/pages/common/types/common'

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待接受', value: 'pending' },
  { label: '已注册', value: 'registered' },
  { label: '已订阅', value: 'subscribed' },
  { label: '已失效', value: 'expired' }
]

const statusColorMap: Record<string, string> = {
  pending: 'gold',
  registered: 'blue',
  subscribed: 'green',
  expired: 'default'
}

const Invitations: React.FC = () => {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [list, setList] = useState<IAdminInvitation[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalInvites: 0,
    successfulInvites: 0,
    pendingInvites: 0,
    totalRewards: 0
  })
  const [current, setCurrent] = useState<IAdminInvitation | null>(null)
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [total, setTotal] = useState(0)

  const loadStats = async () => {
    const { data } = await invitationsService.getStats()
    setStats(data || {})
  }

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      const { data } = await invitationsService.getList({
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
    loadStats()
    loadList()
  }, [loadList])

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

  const columns: ColumnsType<IAdminInvitation> = [
    {
      title: '邀请人',
      dataIndex: 'user',
      render: (_, record) =>
        record.user?.nickname || record.user?.username || record.user?.email || record.userId
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode'
    },
    {
      title: '被邀请邮箱',
      dataIndex: 'inviteeEmail'
    },
    {
      title: '状态',
      dataIndex: 'inviteeStatus',
      render: (value) => <Tag color={statusColorMap[value] || 'default'}>{value}</Tag>
    },
    {
      title: '奖励',
      dataIndex: 'reward',
      render: (value) => value || 0
    },
    {
      title: '邀请时间',
      dataIndex: 'inviteDate',
      width: 180,
      render: (value) => DayJS(value).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Permission code="deeptab.invitations.edit">
          <Button
            type="link"
            onClick={() => {
              setCurrent(record)
              editForm.setFieldsValue({
                inviteeStatus: record.inviteeStatus,
                reward: record.reward
              })
              setVisible(true)
            }}
          >
            编辑
          </Button>
        </Permission>
      )
    }
  ]

  const onSave = async () => {
    if (!current) return
    const values = await editForm.validateFields()
    const { status } = await invitationsService.update(current.id, values)
    if (status === 0) {
      message.success('邀请记录已更新')
      setVisible(false)
      setCurrent(null)
      loadStats()
      loadList()
    }
  }

  return (
    <div className={cn(styles.invitations)}>
      <HeaderWrapper title="邀请管理" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="邮箱 / 邀请码" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="状态">
            <Select options={statusOptions} placeholder="请选择状态" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.summary)}>
            <Card size="small" className={cn(styles.statCard)}>
              <Statistic title="总邀请数" value={stats.totalInvites} />
            </Card>
            <Card size="small" className={cn(styles.statCard)}>
              <Statistic title="成功邀请" value={stats.successfulInvites} />
            </Card>
            <Card size="small" className={cn(styles.statCard)}>
              <Statistic title="待接受" value={stats.pendingInvites} />
            </Card>
            <Card size="small" className={cn(styles.statCard)}>
              <Statistic title="奖励总额" value={stats.totalRewards} />
            </Card>
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
          title="编辑邀请记录"
          onOk={onSave}
          onCancel={() => {
            setVisible(false)
            setCurrent(null)
          }}
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            <Form.Item name="inviteeStatus" label="邀请状态" rules={[{ required: true, message: '请选择状态' }]}>
              <Select options={statusOptions.filter((item) => item.value)} placeholder="请选择邀请状态" />
            </Form.Item>
            <Form.Item name="reward" label="奖励值">
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </ContentWrapper>
    </div>
  )
}

export default Invitations
