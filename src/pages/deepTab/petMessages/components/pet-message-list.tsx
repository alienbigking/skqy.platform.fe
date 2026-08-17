import React from 'react'
import { Button, message, Popconfirm, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import petMessagesService from '../services/petMessages'
import type { IDeepTabPetMessage } from '../types/petMessages'
import {
  categoryOptions,
  languageOptions,
  optionText,
  statusOptions
} from './pet-message-options'

const PetMessageList: React.FC<{
  list: IDeepTabPetMessage[]
  loading: boolean
  pagination: IPagination
  total: number
  onChangeTable: (value: any) => void
  onView: (value: IDeepTabPetMessage) => void
  onEdit: (value: IDeepTabPetMessage) => void
  onRefresh: () => void
}> = (props) => {
  const changeStatus = async (record: IDeepTabPetMessage) => {
    const response =
      record.status === 'published'
        ? await petMessagesService.offline(record.id)
        : await petMessagesService.publish(record.id)
    if (response.status === 0) {
      message.success(record.status === 'published' ? '已下线' : '已发布')
      props.onRefresh()
    }
  }
  const columns: ColumnsType<IDeepTabPetMessage> = [
    { title: '内容', dataIndex: 'content', width: 360 },
    {
      title: '语言',
      dataIndex: 'language',
      width: 110,
      render: (value) => optionText(languageOptions, value)
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 110,
      render: (value) => optionText(categoryOptions, value)
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => (
        <Tag
          color={
            value === 'published'
              ? 'green'
              : value === 'offline'
              ? 'default'
              : 'gold'
          }
        >
          {optionText(statusOptions, value)}
        </Tag>
      )
    },
    { title: '优先级', dataIndex: 'priority', width: 90 },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      width: 180,
      render: (value) => DayJS(value).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => props.onView(record)}>
            查看
          </Button>
          <Permission code="deeptab.petMessage.edit">
            <Button type="link" onClick={() => props.onEdit(record)}>
              编辑
            </Button>
          </Permission>
          <Permission code="deeptab.petMessage.edit">
            <Button type="link" onClick={() => changeStatus(record)}>
              {record.status === 'published' ? '下线' : '发布'}
            </Button>
          </Permission>
          <Permission code="deeptab.petMessage.delete">
            <Popconfirm
              title="确认删除该语录吗？"
              onConfirm={async () => {
                const response = await petMessagesService.delete(record.id)
                if (response.status === 0) {
                  message.success('删除成功')
                  props.onRefresh()
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
      loading={props.loading}
      columns={columns}
      dataSource={props.list}
      onChange={props.onChangeTable}
      scroll={{ x: 'max-content' }}
      pagination={{
        total: props.total,
        current: props.pagination.page,
        pageSize: props.pagination.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `总计${total}条`
      }}
    />
  )
}

export default PetMessageList
