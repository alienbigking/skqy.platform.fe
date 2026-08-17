import React from 'react'
import { Descriptions, Modal } from 'antd'
import DayJS from 'dayjs'
import type { IDeepTabPetMessage } from '../types/petMessages'
import {
  categoryOptions,
  languageOptions,
  optionText,
  statusOptions
} from './pet-message-options'

const PetMessageDetail: React.FC<{
  open: boolean
  record: IDeepTabPetMessage | null
  onCancel: () => void
}> = ({ open, record, onCancel }) => (
  <Modal
    open={open}
    title="宠物语录详情"
    width={720}
    footer={null}
    onCancel={onCancel}
    destroyOnClose
  >
    {record && (
      <Descriptions
        bordered
        column={2}
        styles={{ label: { whiteSpace: 'nowrap' } }}
      >
        <Descriptions.Item label="内容" span={2}>
          {record.content}
        </Descriptions.Item>
        <Descriptions.Item label="语言">
          {optionText(languageOptions, record.language)}
        </Descriptions.Item>
        <Descriptions.Item label="分类">
          {optionText(categoryOptions, record.category)}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {optionText(statusOptions, record.status)}
        </Descriptions.Item>
        <Descriptions.Item label="优先级">{record.priority}</Descriptions.Item>
        <Descriptions.Item label="显示秒数">
          {record.durationSeconds}s
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {DayJS(record.updateDate).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
)

export default PetMessageDetail
