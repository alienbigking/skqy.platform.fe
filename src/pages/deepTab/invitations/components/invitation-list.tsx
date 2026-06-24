import React from 'react'
import { Button, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import type { IAdminInvitation } from '../types/invitations'
import { statusColorMap, statusTextMap } from './invitation-options'

interface IInvitationListProps {
  list: IAdminInvitation[]
  loading: boolean
  pagination: IPagination
  total: number
  onChangeTable: (pagination: any) => void
  onEdit: (record: IAdminInvitation) => void
}

const InvitationList: React.FC<IInvitationListProps> = ({
  list,
  loading,
  pagination,
  total,
  onChangeTable,
  onEdit
}) => {
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
      render: (value) => <Tag color={statusColorMap[value] || 'default'}>{statusTextMap[value] || value}</Tag>
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
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
        </Permission>
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

export default InvitationList
