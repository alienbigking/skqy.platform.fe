import React from 'react'
import cn from 'classnames'
import { Button, message, Popconfirm, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import syncService from '../services/sync'
import type { ISyncRecord } from '../types/sync'
import styles from './sync.less'

interface ISyncListProps {
  list: ISyncRecord[]
  loading: boolean
  pagination: IPagination
  total: number
  onChangeTable: (pagination: any) => void
  onOpenDetail: (record: ISyncRecord) => void
  onRefresh: () => void
}

const SyncList: React.FC<ISyncListProps> = ({
  list,
  loading,
  pagination,
  total,
  onChangeTable,
  onOpenDetail,
  onRefresh
}) => {
  const columns: ColumnsType<ISyncRecord> = [
    {
      title: '用户',
      dataIndex: 'user',
      render: (_, record) =>
        record.user?.nickname || record.user?.username || record.user?.email || record.userId
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 100
    },
    {
      title: '同步项数',
      dataIndex: 'payload',
      render: (value) => <Tag>{Object.keys(value || {}).length}</Tag>
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
        <div className={cn(styles.tableActions)}>
          <Button type="link" onClick={() => onOpenDetail(record)}>
            查看
          </Button>
          <Permission code="deeptab.sync.delete">
            <Popconfirm
              title="确认删除该同步记录吗？"
              onConfirm={async () => {
                const { status } = await syncService.delete(record.id)
                if (status === 0) {
                  message.success('同步记录已删除')
                  onRefresh()
                }
              }}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
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

export default SyncList
