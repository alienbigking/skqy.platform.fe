import React from 'react'
import { Descriptions, Modal, Tag } from 'antd'
import DayJS from 'dayjs'
import type { IDeepTabNotification, NotificationStatus, NotificationType } from '../types/notifications'
import { statusColorMap, statusTextMap, typeColorMap, typeTextMap } from './notification-options'

interface INotificationDetailProps {
  open: boolean
  record: IDeepTabNotification | null
  onCancel: () => void
}

const formatTime = (value?: number) => (value ? DayJS(value).format('YYYY-MM-DD HH:mm:ss') : '-')

const NotificationDetail: React.FC<INotificationDetailProps> = ({ open, record, onCancel }) => (
  <Modal open={open} title="通知详情" width={860} footer={null} onCancel={onCancel} destroyOnClose>
    {record && (
      <Descriptions bordered column={2} size="small" styles={{ label: { whiteSpace: 'nowrap' } }}>
        <Descriptions.Item label="标题" span={2}>
          {record.title}
        </Descriptions.Item>
        <Descriptions.Item label="内容" span={2}>
          {record.content}
        </Descriptions.Item>
        <Descriptions.Item label="类型">
          <Tag color={typeColorMap[record.type as NotificationType] || 'blue'}>
            {typeTextMap[record.type as NotificationType] || record.type}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusColorMap[record.status as NotificationStatus] || 'default'}>
            {statusTextMap[record.status as NotificationStatus] || record.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="按钮文案">{record.actionText || '-'}</Descriptions.Item>
        <Descriptions.Item label="跳转链接">{record.actionUrl || '-'}</Descriptions.Item>
        <Descriptions.Item label="优先级">{record.priority}</Descriptions.Item>
        <Descriptions.Item label="显示秒数">{record.durationSeconds || 10}s</Descriptions.Item>
        <Descriptions.Item label="开始时间">{formatTime(record.startAt)}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{formatTime(record.endAt)}</Descriptions.Item>
        <Descriptions.Item label="发布时间">{formatTime(record.publishedAt)}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{formatTime(record.updateDate)}</Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
)

export default NotificationDetail
