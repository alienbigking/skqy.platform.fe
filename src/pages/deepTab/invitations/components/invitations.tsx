import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './invitations.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Card, Col, Form, Input, Select, Statistic } from 'antd'
import invitationsService from '../services/invitations'
import type { IAdminInvitation } from '../types/invitations'
import type { IPagination } from '@/pages/common/types/common'
import InvitationEdit from './invitation-edit'
import InvitationList from './invitation-list'
import { statusOptions } from './invitation-options'

const Invitations: React.FC = () => {
  const [form] = Form.useForm()
  const [list, setList] = useState<IAdminInvitation[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalInvites: 0,
    successfulInvites: 0,
    pendingInvites: 0,
    totalRewards: 0
  })
  const [current, setCurrent] = useState<IAdminInvitation | null>(null)
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
            <InvitationList
              list={list}
              loading={loading}
              pagination={pagination}
              total={total}
              onChangeTable={onChangeTable}
              onEdit={setCurrent}
            />
          </div>
        </div>

        <InvitationEdit
          open={!!current}
          record={current}
          onCancel={() => setCurrent(null)}
          onSuccess={() => {
            setCurrent(null)
            loadStats()
            loadList()
          }}
        />
      </ContentWrapper>
    </div>
  )
}

export default Invitations
