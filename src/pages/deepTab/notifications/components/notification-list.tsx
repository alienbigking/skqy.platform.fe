import React from 'react'
import cn from 'classnames'
import { Button, message, Popconfirm, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import notificationsService from '../services/notifications'
import type { IDeepTabNotification, NotificationStatus, NotificationType } from '../types/notifications'
import styles from './notifications.less'
import { statusColorMap, statusTextMap, typeColorMap, typeTextMap } from './notification-options'

interface INotificationListProps {
  list: IDeepTabNotification[]
  loading: boolean
  pagination: IPagination
  total: number
  onChangeTable: (pagination: any) => void
  onView: (record: IDeepTabNotification) => void
  onEdit: (record: IDeepTabNotification) => void
  onRefresh: () => void
}

const NotificationList: React.FC<INotificationListProps> = ({
  list,
  loading,
  pagination,
  total,
  onChangeTable,
  onView,
  onEdit,
  onRefresh
}) => {
  const onPublish = async (record: IDeepTabNotification) => {
    const { status } = await notificationsService.publish(record.id)
    if (status === 0) {
      message.success('发布成功')
      onRefresh()
    }
  }

  const onOffline = async (record: IDeepTabNotification) => {
    const { status } = await notificationsService.offline(record.id)
    if (status === 0) {
      message.success('已下线')
      onRefresh()
    }
  }

  const columns: ColumnsType<IDeepTabNotification> = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '内容',
      dataIndex: 'content',
      render: (value) => <div className={cn(styles.messagePreview)}>{value || '-'}</div>
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (value: NotificationType) => (
        <Tag color={typeColorMap[value] || 'blue'}>{typeTextMap[value] || value}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: NotificationStatus) => (
        <Tag color={statusColorMap[value] || 'default'}>{statusTextMap[value] || value}</Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 90
    },
    {
      title: '显示秒数',
      dataIndex: 'durationSeconds',
      width: 100,
      render: (value) => `${value || 10}s`
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      width: 180,
      render: (value) => (value ? DayJS(value).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      width: 180,
      render: (value) => DayJS(value).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 300,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onView(record)}>
            查看
          </Button>
          <Permission code="deeptab.notification.edit">
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
          </Permission>
          <Permission code="deeptab.notification.edit">
            {record.status === 'published' ? (
              <Button type="link" onClick={() => onOffline(record)}>
                下线
              </Button>
            ) : (
              <Button type="link" onClick={() => onPublish(record)}>
                发布
              </Button>
            )}
          </Permission>
          <Permission code="deeptab.notification.delete">
            <Popconfirm
              title="确认删除该通知吗？"
              onConfirm={async () => {
                const { status } = await notificationsService.delete(record.id)
                if (status === 0) {
                  message.success('删除成功')
                  onRefresh()
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

  return (
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
  )
}

export default NotificationList
