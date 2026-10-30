import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  Tag
} from 'antd'
import {
  EyeOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import service from '../services/wallet'
import type { Entity, IWalletRecord } from '../types/wallet'
import styles from './wallet.less'

const labels: Record<string, string> = {
  pending: '待审核',
  visible: '审核通过',
  hidden: '审核拒绝',
  resolved: '已处理并隐藏',
  dismissed: '已驳回举报'
}

const approvalLabels: Record<string, string> = {
  pending: '审批中',
  approved: '已通过',
  rejected: '已驳回',
  inconclusive: '未形成结论'
}

const purchaseLabels: Record<string, string> = {
  undecided: '尚未确认',
  purchased: '决定购买',
  abandoned: '确认放弃'
}

const Wallet: React.FC = () => {
  const [filterForm] = Form.useForm()

  const [handleForm] = Form.useForm()

  const [entity, setEntity] = useState<Entity>('applications')

  const [rows, setRows] = useState<IWalletRecord[]>([])

  const [loading, setLoading] = useState(false)

  const [saving, setSaving] = useState(false)

  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(1)

  const [pageSize, setPageSize] = useState(20)

  const [revision, setRevision] = useState(0)

  const [current, setCurrent] = useState<IWalletRecord | null>(null)

  const [handleOpen, setHandleOpen] = useState(false)

  const sequence = useRef(0)

  const statuses =
    entity === 'reports'
      ? ['pending', 'resolved', 'dismissed']
      : ['pending', 'visible', 'hidden']

  const load = useCallback(async () => {
    const requestId = ++sequence.current
    setLoading(true)
    try {
      const response = await service.list(entity, {
        page,
        pageSize,
        ...filterForm.getFieldsValue()
      })
      if (requestId !== sequence.current) return
      if (response.status === 0) {
        setRows(response.data.list)
        setTotal(response.data.total)
      } else message.error(response.message || '读取内容失败')
    } catch {
      if (requestId === sequence.current) message.error('读取失败，请稍后重试')
    } finally {
      if (requestId === sequence.current) setLoading(false)
    }
  }, [entity, page, pageSize, revision, filterForm])
  useEffect(() => {
    load()
  }, [load])
  const openHandle = (record: IWalletRecord) => {
    setCurrent(record)
    handleForm.resetFields()
    handleForm.setFieldsValue({
      status: entity === 'reports' ? 'resolved' : 'visible'
    })
    setHandleOpen(true)
  }

  const submit = async () => {
    const values = await handleForm.validateFields()
    if (!current) return
    setSaving(true)
    try {
      const response = await service.handle(entity, current.id, values)
      if (response.status === 0) {
        message.success('处理结果已保存')
        setHandleOpen(false)
        setCurrent(null)
        setRevision((v) => v + 1)
      } else message.error(response.message || '处理失败')
    } catch {
      message.error('提交失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const disable = (record: IWalletRecord) => {
    const userId = record.targetUserId
    if (!userId) return
    Modal.confirm({
      title: '停用该内容作者账号？',
      content:
        '用户将无法继续使用钱包慢点；可在用户管理中恢复。举报人不会被停用。',
      onOk: async () => {
        const response = await service.disable(userId)
        if (response.data?.status === 0 || response.status === 0) {
          message.success('账号已停用')
          setRevision((v) => v + 1)
        } else {
          message.error(response.message || '操作失败')
          throw new Error('停用失败')
        }
      }
    })
  }

  const columns = [
    {
      title:
        entity === 'applications'
          ? '商品 / 购买理由'
          : entity === 'comments'
          ? '评论内容'
          : '举报原因',
      key: 'content',
      render: (_: unknown, record: IWalletRecord) => (
        <div className={styles.summary}>
          <strong>
            {record.productName || record.content || record.reason}
          </strong>
          <div>
            {entity === 'applications'
              ? record.reason
              : record.application?.productName}
          </div>
        </div>
      )
    },
    {
      title: entity === 'reports' ? '举报人' : '作者',
      dataIndex: 'nickname',
      width: 130
    },
    ...(entity === 'applications'
      ? [
          {
            title: '金额',
            key: 'amount',
            width: 120,
            render: (_: unknown, record: IWalletRecord) =>
              `¥ ${((record.amountCents || 0) / 100).toFixed(2)}`
          }
        ]
      : []),
    {
      title: '状态',
      key: 'status',
      width: 130,
      render: (_: unknown, record: IWalletRecord) => {
        const status = record.moderationStatus || record.status || ''
        return (
          <Tag
            color={
              status === 'visible'
                ? 'green'
                : status === 'pending'
                ? 'gold'
                : 'default'
            }
          >
            {labels[status] || status}
          </Tag>
        )
      }
    },
    {
      title: '提交时间',
      dataIndex: 'createDate',
      width: 180,
      render: (value: number) => new Date(value).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 270,
      render: (_: unknown, record: IWalletRecord) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setCurrent(record)}
          >
            详情
          </Button>
          <Button type="link" onClick={() => openHandle(record)}>
            处理
          </Button>
          <Button
            danger
            type="link"
            icon={<SafetyCertificateOutlined />}
            onClick={() => disable(record)}
          >
            停用作者
          </Button>
        </Space>
      )
    }
  ]
  return (
    <div className={styles.wallet}>
      <HeaderWrapper
        title="钱包慢点 · 内容治理"
        form={filterForm}
        onSearchCallback={() => {
          setPage(1)
          setRevision((v) => v + 1)
        }}
        onResetCallback={() => {
          filterForm.resetFields()
          setPage(1)
          setRevision((v) => v + 1)
        }}
      >
        <Col span={8}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="商品 / 内容 / 举报原因" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="状态">
            <Select
              options={statuses.map((value) => ({
                value,
                label: labels[value]
              }))}
              allowClear
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={styles.content}>
          <div className={styles.toolbar}>
            <Tabs
              activeKey={entity}
              onChange={(key) => {
                filterForm.resetFields()
                setEntity(key as Entity)
                setPage(1)
                setCurrent(null)
                setHandleOpen(false)
              }}
              items={[
                { key: 'applications', label: '申请审核' },
                { key: 'comments', label: '评论审核' },
                { key: 'reports', label: '举报处理' }
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={load}>
              刷新
            </Button>
          </div>
          <Table<IWalletRecord>
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: (next, size) => {
                setPage(next)
                setPageSize(size)
              }
            }}
          />
        </div>
      </ContentWrapper>
      <Drawer
        width={640}
        title="内容详情"
        open={!!current && !handleOpen}
        onClose={() => setCurrent(null)}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="内容 ID">{current?.id}</Descriptions.Item>
          <Descriptions.Item label="用户">
            {current?.nickname} ({current?.userId})
          </Descriptions.Item>
          <Descriptions.Item label="商品">
            {current?.productName || current?.application?.productName}
          </Descriptions.Item>
          <Descriptions.Item label="内容">
            {current?.reason ||
              current?.content ||
              current?.application?.reason}
          </Descriptions.Item>
          <Descriptions.Item label="被举报评论">
            {current?.comment?.content || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="替代品">
            {current?.alternativeNote || current?.alternative || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="审批结论">
            {approvalLabels[current?.approvalStatus || ''] || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="购买决定">
            {purchaseLabels[current?.purchaseDecision || ''] || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="处理备注">
            {current?.adminRemark || '-'}
          </Descriptions.Item>
        </Descriptions>
        <Image.PreviewGroup>
          {(current?.images || current?.application?.images || []).map(
            (url) => (
              <Image key={url} width={160} src={service.imageUrl(url)} />
            )
          )}
        </Image.PreviewGroup>
        <Button
          className={styles.handleButton}
          type="primary"
          onClick={() => current && openHandle(current)}
        >
          处理此内容
        </Button>
      </Drawer>
      <Modal
        title={entity === 'reports' ? '处理举报' : '审核内容'}
        open={handleOpen}
        confirmLoading={saving}
        onOk={submit}
        onCancel={() => {
          setHandleOpen(false)
          setCurrent(null)
        }}
      >
        <Form form={handleForm} layout="vertical">
          <Form.Item
            name="status"
            label="处理结果"
            rules={[{ required: true }]}
          >
            <Select
              options={(entity === 'reports'
                ? ['resolved', 'dismissed']
                : ['visible', 'hidden']
              ).map((value) => ({ value, label: labels[value] }))}
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label="处理备注"
            rules={[{ required: true, whitespace: true, max: 500 }]}
          >
            <Input.TextArea rows={4} maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Wallet
