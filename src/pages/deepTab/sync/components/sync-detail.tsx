import React from 'react'
import { Descriptions, Input, Modal } from 'antd'
import DayJS from 'dayjs'
import type { ISyncRecord } from '../types/sync'

interface ISyncDetailProps {
  open: boolean
  record: ISyncRecord | null
  onCancel: () => void
}

const SyncDetail: React.FC<ISyncDetailProps> = ({ open, record, onCancel }) => (
  <Modal open={open} title="同步详情" width={900} footer={null} onCancel={onCancel}>
    {record && (
      <>
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
          <Descriptions.Item label="用户">
            {record.user?.nickname || record.user?.username || record.user?.email || record.userId}
          </Descriptions.Item>
          <Descriptions.Item label="版本">{record.version}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {DayJS(record.createDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {DayJS(record.updateDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
        <Input.TextArea value={JSON.stringify(record.payload || {}, null, 2)} rows={20} readOnly />
      </>
    )}
  </Modal>
)

export default SyncDetail
