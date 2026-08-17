import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Select } from 'antd'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Permission } from '@/components/permission'
import type { IPagination } from '@/pages/common/types/common'
import petMessagesService from '../services/petMessages'
import type { IDeepTabPetMessage } from '../types/petMessages'
import PetMessageCreate from './pet-message-create'
import PetMessageDetail from './pet-message-detail'
import PetMessageEdit from './pet-message-edit'
import PetMessageList from './pet-message-list'
import {
  categoryOptions,
  languageOptions,
  statusOptions
} from './pet-message-options'
import styles from './petMessages.less'

const PetMessages: React.FC = () => {
  const [form] = Form.useForm()
  const [list, setList] = useState<IDeepTabPetMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<IDeepTabPetMessage | null>(null)
  const [detail, setDetail] = useState<IDeepTabPetMessage | null>(null)
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await petMessagesService.getList({
        ...form.getFieldsValue(),
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
  const search = () =>
    setPagination((value) => ({ page: 1, pageSize: value.pageSize }))
  return (
    <div className={styles.petMessages}>
      <HeaderWrapper
        title="宠物语录管理"
        form={form}
        onSearchCallback={search}
        onResetCallback={() => setPagination({ page: 1, pageSize: 10 })}
      >
        <Col span={6}>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="请输入语录内容" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="language" label="语言">
            <Select
              allowClear
              options={languageOptions}
              placeholder="请选择语言"
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="category" label="分类">
            <Select
              allowClear
              options={categoryOptions}
              placeholder="请选择分类"
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="状态">
            <Select
              allowClear
              options={statusOptions}
              placeholder="请选择状态"
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={styles.main}>
          <div className={styles.actions}>
            <Permission code="deeptab.petMessage.create">
              <Button
                type="primary"
                className="gMainButton"
                onClick={() => setCreateOpen(true)}
              >
                新增语录
              </Button>
            </Permission>
          </div>
          <div className={styles.content}>
            <PetMessageList
              list={list}
              loading={loading}
              pagination={pagination}
              total={total}
              onChangeTable={(next) =>
                setPagination({ page: next.current, pageSize: next.pageSize })
              }
              onView={setDetail}
              onEdit={setEditing}
              onRefresh={load}
            />
          </div>
        </div>
        <PetMessageCreate
          open={createOpen}
          onCancel={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false)
            load()
          }}
        />
        <PetMessageEdit
          open={!!editing}
          record={editing}
          onCancel={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null)
            load()
          }}
        />
        <PetMessageDetail
          open={!!detail}
          record={detail}
          onCancel={() => setDetail(null)}
        />
      </ContentWrapper>
    </div>
  )
}

export default PetMessages
