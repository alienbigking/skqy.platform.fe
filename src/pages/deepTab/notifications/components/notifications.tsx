import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './notifications.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, Select } from 'antd'
import { Permission } from '@/components/permission'
import notificationsService from '../services/notifications'
import type { IDeepTabNotification } from '../types/notifications'
import type { IPagination } from '@/pages/common/types/common'
import NotificationCreate from './notification-create'
import NotificationDetail from './notification-detail'
import NotificationEdit from './notification-edit'
import NotificationList from './notification-list'
import { statusOptions, typeOptions } from './notification-options'

const Notifications: React.FC = () => {
  const [form] = Form.useForm()
  const [list, setList] = useState<IDeepTabNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)
  const [editing, setEditing] = useState<IDeepTabNotification | null>(null)
  const [detail, setDetail] = useState<IDeepTabNotification | null>(null)
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      const { data } = await notificationsService.getList({
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

  return (
    <div className={cn(styles.notifications)}>
      <HeaderWrapper title="通知管理" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="标题 / 内容" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="type" label="类型">
            <Select options={typeOptions} placeholder="请选择类型" allowClear />
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
          <div className={cn(styles.actions)}>
            <Permission code="deeptab.notification.create">
              <Button type="primary" className={cn(['gMainButton'])} onClick={() => setCreateVisible(true)}>
                新增通知
              </Button>
            </Permission>
          </div>
          <div className={cn(styles.content)}>
            <NotificationList
              list={list}
              loading={loading}
              pagination={pagination}
              total={total}
              onChangeTable={onChangeTable}
              onView={setDetail}
              onEdit={setEditing}
              onRefresh={load}
            />
          </div>
        </div>

        <NotificationCreate
          open={createVisible}
          onCancel={() => setCreateVisible(false)}
          onSuccess={() => {
            setCreateVisible(false)
            load()
          }}
        />
        <NotificationEdit
          open={!!editing}
          record={editing}
          onCancel={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null)
            load()
          }}
        />
        <NotificationDetail open={!!detail} record={detail} onCancel={() => setDetail(null)} />
      </ContentWrapper>
    </div>
  )
}

export default Notifications
