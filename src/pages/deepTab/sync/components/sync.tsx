import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './sync.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Descriptions, Form, Input, message, Modal, Popconfirm, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import syncService from '../services/sync'
import type { ISyncRecord } from '../types/sync'
import type { IPagination } from '@/pages/common/types/common'

const Sync: React.FC = () => {
  const [form] = Form.useForm()
  const [list, setList] = useState<ISyncRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [total, setTotal] = useState(0)
  const [detailVisible, setDetailVisible] = useState(false)
  const [current, setCurrent] = useState<ISyncRecord | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      const { data } = await syncService.getList({
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
          <Button
            type="link"
            onClick={async () => {
              const { data } = await syncService.getDetail(record.id)
              setCurrent(data?.syncData || record)
              setDetailVisible(true)
            }}
          >
            查看
          </Button>
          <Permission code="deeptab.sync.delete">
            <Popconfirm
              title="确认删除该同步记录吗？"
              onConfirm={async () => {
                const { status } = await syncService.delete(record.id)
                if (status === 0) {
                  message.success('同步记录已删除')
                  load()
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
    <div className={cn(styles.sync)}>
      <HeaderWrapper title="同步记录" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="用户ID / 用户名 / 邮箱 / 手机号" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
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
          open={detailVisible}
          title="同步详情"
          width={900}
          footer={null}
          onCancel={() => {
            setDetailVisible(false)
            setCurrent(null)
          }}
        >
          {current && (
            <>
              <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="用户">
                  {current.user?.nickname || current.user?.username || current.user?.email || current.userId}
                </Descriptions.Item>
                <Descriptions.Item label="版本">{current.version}</Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {DayJS(current.createDate).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {DayJS(current.updateDate).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
              <Input.TextArea value={JSON.stringify(current.payload || {}, null, 2)} rows={20} readOnly />
            </>
          )}
        </Modal>
      </ContentWrapper>
    </div>
  )
}

export default Sync
