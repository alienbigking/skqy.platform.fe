import React from 'react'
import cn from 'classnames'
import { Button, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import type { IAdminFeedback } from '../types/feedback'
import styles from './feedback.less'
import { statusColorMap, statusTextMap } from './feedback-options'

interface IFeedbackListProps {
  list: IAdminFeedback[]
  loading: boolean
  pagination: IPagination
  total: number
  onChangeTable: (pagination: any) => void
  onOpenDetail: (record: IAdminFeedback) => void
}

const FeedbackList: React.FC<IFeedbackListProps> = ({
  list,
  loading,
  pagination,
  total,
  onChangeTable,
  onOpenDetail
}) => {
  const columns: ColumnsType<IAdminFeedback> = [
    {
      title: '用户',
      dataIndex: 'user',
      render: (_, record) =>
        record.user?.nickname || record.user?.username || record.user?.email || record.userId
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (value) => value || '-'
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (value) => value || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value) => <Tag color={statusColorMap[value] || 'default'}>{statusTextMap[value] || '待处理'}</Tag>
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      render: (value) => value || '-'
    },
    {
      title: '提交时间',
      dataIndex: 'createDate',
      width: 180,
      render: (value) => DayJS(value).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <div className={cn(styles.tableActions)}>
          <Button type="link" onClick={() => onOpenDetail(record)}>
            查看
          </Button>
          <Permission code="deeptab.feedback.handle">
            <Button type="link" onClick={() => onOpenDetail(record)}>
              处理
            </Button>
          </Permission>
        </div>
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

export default FeedbackList
