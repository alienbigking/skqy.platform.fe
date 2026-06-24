import React, { useEffect } from 'react'
import cn from 'classnames'
import { Descriptions, Form, Input, Modal, Select, Space, Tag } from 'antd'
import type { FormInstance } from 'antd'
import type { IAdminFeedback } from '../types/feedback'
import styles from './feedback.less'
import { feedbackStatusOptions, statusColorMap, statusTextMap } from './feedback-options'

interface IFeedbackDetailProps {
  open: boolean
  form: FormInstance
  record: IAdminFeedback | null
  onOk: () => void
  onCancel: () => void
}

const FeedbackDetail: React.FC<IFeedbackDetailProps> = ({ open, form, record, onOk, onCancel }) => {
  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        status: record.status || 'pending',
        adminRemark: record.adminRemark || ''
      })
    }
  }, [form, open, record])

  return (
    <Modal open={open} title="反馈详情" width={860} onOk={onOk} onCancel={onCancel} destroyOnClose>
      {record && (
        <>
          <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="用户">
              {record.user?.nickname || record.user?.username || record.userId}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusColorMap[record.status] || 'default'}>
                {statusTextMap[record.status] || '待处理'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="标题">{record.title || '-'}</Descriptions.Item>
            <Descriptions.Item label="类型">{record.type || '-'}</Descriptions.Item>
            <Descriptions.Item label="联系方式" span={2} styles={{ label: { whiteSpace: 'nowrap' } }}>
              {record.contact || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="提交内容" span={2} styles={{ label: { whiteSpace: 'nowrap' } }}>
              <div className={cn(styles.preWrap)}>{record.content || '-'}</div>
            </Descriptions.Item>
            <Descriptions.Item label="附件">
              {record.attachments?.length ? (
                <Space wrap>
                  {record.attachments.map((item) => (
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

          <Form form={form} layout="vertical">
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
  )
}

export default FeedbackDetail
