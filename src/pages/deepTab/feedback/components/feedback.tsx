import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './feedback.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Descriptions, Form, Input, message, Modal, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import feedbackService from '../services/feedback'
import type { IAdminFeedback } from '../types/feedback'
import type { IPagination } from '@/pages/common/types/common'

const feedbackTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '功能建议', value: 'feature' },
  { label: '问题反馈', value: 'bug' },
  { label: '体验优化', value: 'experience' },
  { label: '其他', value: 'other' }
]

const feedbackStatusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已解决', value: 'resolved' },
  { label: '已关闭', value: 'closed' }
]

const statusColorMap: Record<string, string> = {
  pending: 'gold',
  processing: 'blue',
  resolved: 'green',
  closed: 'default'
}

const statusTextMap: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭'
}

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
    const feedback = data?.feedback || record
    setCurrent(feedback)
    handleForm.setFieldsValue({
      status: feedback.status || 'pending',
      adminRemark: feedback.adminRemark || ''
    })
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
          <Button type="link" onClick={() => openDetail(record)}>
            查看
          </Button>
          <Permission code="deeptab.feedback.handle">
            <Button type="link" onClick={() => openDetail(record)}>
              处理
            </Button>
          </Permission>
        </div>
      )
    }
  ]

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
          title="反馈详情"
          width={860}
          onOk={onHandle}
          onCancel={() => {
            setDetailVisible(false)
            setCurrent(null)
          }}
          destroyOnClose
        >
          {current && (
            <>
              <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="用户">
                  {current.user?.nickname || current.user?.username || current.userId}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusColorMap[current.status] || 'default'}>
                    {statusTextMap[current.status] || '待处理'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="标题">{current.title || '-'}</Descriptions.Item>
                <Descriptions.Item label="类型">{current.type || '-'}</Descriptions.Item>
                <Descriptions.Item label="联系方式" span={2} styles={{ label: { whiteSpace: 'nowrap' } }}>
                  {current.contact || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="提交内容" span={2} styles={{ label: { whiteSpace: 'nowrap' } }}>
                  <div className={cn(styles.preWrap)}>{current.content || '-'}</div>
                </Descriptions.Item>
                <Descriptions.Item label="附件">
                  {current.attachments?.length ? (
                    <Space wrap>
                      {current.attachments.map((item) => (
                        <a key={item} href={item} target="_blank" rel="noreferrer">
                          {item}
                        </a>
                      ))}
                    </Space>
                  ) : (
                    '-'
                  )}
                </Descriptions.Item>
              </Descriptions>

              <Form form={handleForm} layout="vertical">
                <Form.Item name="status" label="处理状态" rules={[{ required: true, message: '请选择状态' }]}>
                  <Select options={feedbackStatusOptions.filter((item) => item.value)} />
                </Form.Item>
                <Form.Item name="adminRemark" label="处理备注">
                  <Input.TextArea rows={4} placeholder="记录处理结果、跟进说明等" />
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>
      </ContentWrapper>
    </div>
  )
}

export default Feedback
