import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './sync.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Col, Form, Input } from 'antd'
import syncService from '../services/sync'
import type { ISyncRecord } from '../types/sync'
import type { IPagination } from '@/pages/common/types/common'
import SyncDetail from './sync-detail'
import SyncList from './sync-list'

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

  const openDetail = async (record: ISyncRecord) => {
    const { data } = await syncService.getDetail(record.id)
    setCurrent(data?.syncData || record)
    setDetailVisible(true)
  }

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
            <SyncList
              list={list}
              loading={loading}
              pagination={pagination}
              total={total}
              onChangeTable={onChangeTable}
              onOpenDetail={openDetail}
              onRefresh={load}
            />
          </div>
        </div>

        <SyncDetail
          open={detailVisible}
          record={current}
          onCancel={() => {
            setDetailVisible(false)
            setCurrent(null)
          }}
        />
      </ContentWrapper>
    </div>
  )
}

export default Sync
