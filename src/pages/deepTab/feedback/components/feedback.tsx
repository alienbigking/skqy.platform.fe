import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './feedback.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Col, Form, Input, message, Select } from 'antd'
import feedbackService from '../services/feedback'
import type { IAdminFeedback } from '../types/feedback'
import type { IPagination } from '@/pages/common/types/common'
import FeedbackDetail from './feedback-detail'
import FeedbackList from './feedback-list'
import { feedbackStatusOptions, feedbackTypeOptions } from './feedback-options'

const Feedback: React.FC = () => {
  const [form] = Form.useForm()
  const [handleForm] = Form.useForm()
  const [list, setList] = useState<IAdminFeedback[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [current, setCurrent] = useState<IAdminFeedback | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      const { data } = await feedbackService.getList({
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

  const openDetail = async (record: IAdminFeedback) => {
    const { data } = await feedbackService.getDetail(record.id)
    setCurrent(data?.feedback || record)
    setDetailVisible(true)
  }

  const onHandle = async () => {
    if (!current) return
    const values = await handleForm.validateFields()
    const { status } = await feedbackService.update(current.id, values)
    if (status === 0) {
      message.success('处理结果已更新')
      setDetailVisible(false)
      setCurrent(null)
      load()
    }
  }

  return (
    <div className={cn(styles.feedback)}>
      <HeaderWrapper title="反馈管理" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="标题 / 内容 / 联系方式" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="type" label="类型">
            <Select options={feedbackTypeOptions} placeholder="请选择类型" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="状态">
            <Select options={feedbackStatusOptions} placeholder="请选择状态" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.content)}>
            <FeedbackList
              list={list}
              loading={loading}
              pagination={pagination}
              total={total}
              onChangeTable={onChangeTable}
              onOpenDetail={openDetail}
            />
          </div>
        </div>

        <FeedbackDetail
          open={detailVisible}
          form={handleForm}
          record={current}
          onOk={onHandle}
          onCancel={() => {
            setDetailVisible(false)
            setCurrent(null)
          }}
        />
      </ContentWrapper>
    </div>
  )
}

export default Feedback
