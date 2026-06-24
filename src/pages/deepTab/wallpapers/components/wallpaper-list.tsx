import React from 'react'
import { Button, message, Popconfirm, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import wallpapersService from '../services/wallpapers'
import type { IWallpaperRecord } from '../types/wallpapers'

interface IWallpaperListProps {
  list: IWallpaperRecord[]
  loading: boolean
  pagination: IPagination
  total: number
  onChangeTable: (pagination: any) => void
  onView: (record: IWallpaperRecord) => void
  onEdit: (record: IWallpaperRecord) => void
  onRefresh: () => void
}

const WallpaperList: React.FC<IWallpaperListProps> = ({
  list,
  loading,
  pagination,
  total,
  onChangeTable,
  onView,
  onEdit,
  onRefresh
}) => {
  const columns: ColumnsType<IWallpaperRecord> = [
    {
      title: '预览',
      dataIndex: 'thumbnail',
      width: 140,
      render: (value) => (
        <img
          src={value}
          alt=""
          style={{ width: 112, height: 63, borderRadius: 8, objectFit: 'cover', display: 'block' }}
        />
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (value) => (
        <Tag color={value === 'dynamic' ? 'blue' : 'green'}>{value === 'dynamic' ? '动态壁纸' : '精选图片'}</Tag>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (value) => value || '-'
    },
    {
      title: '分类',
      dataIndex: 'category'
    },
    {
      title: '来源',
      dataIndex: 'source',
      render: (value) => value || '-'
    },
    {
      title: '排序',
      dataIndex: 'sortOrder'
    },
    {
      title: '启用',
      dataIndex: 'isActive',
      render: (value) => <Switch checked={!!value} disabled />
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      width: 180,
      render: (value) => DayJS(value).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onView(record)}>
            查看
          </Button>
          <Permission code="deeptab.wallpaper.edit">
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
          </Permission>
          <Permission code="deeptab.wallpaper.delete">
            <Popconfirm
              title="确认删除该壁纸吗？"
              onConfirm={async () => {
                const { status } = await wallpapersService.delete(record.id)
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

export default WallpaperList
