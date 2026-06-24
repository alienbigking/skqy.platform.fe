import React from 'react'
import { Descriptions, Modal, Space, Switch, Tag } from 'antd'
import DayJS from 'dayjs'
import type { IWallpaperRecord } from '../types/wallpapers'

interface IWallpaperDetailProps {
  open: boolean
  record: IWallpaperRecord | null
  onCancel: () => void
}

const WallpaperDetail: React.FC<IWallpaperDetailProps> = ({ open, record, onCancel }) => (
  <Modal open={open} title="壁纸详情" width={860} footer={null} onCancel={onCancel} destroyOnClose>
    {record && (
      <Descriptions bordered column={2} size="small" styles={{ label: { whiteSpace: 'nowrap' } }}>
        <Descriptions.Item label="预览" span={2}>
          <img
            src={record.thumbnail || record.url || record.videoUrl}
            alt=""
            style={{ width: 240, height: 135, borderRadius: 10, objectFit: 'cover', display: 'block' }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="标题">{record.title || '-'}</Descriptions.Item>
        <Descriptions.Item label="类型">
          <Tag color={record.type === 'dynamic' ? 'blue' : 'green'}>
            {record.type === 'dynamic' ? '动态壁纸' : '精选图片'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="分类">{record.category || '-'}</Descriptions.Item>
        <Descriptions.Item label="来源">{record.source || '-'}</Descriptions.Item>
        <Descriptions.Item label="作者">{record.author || '-'}</Descriptions.Item>
        <Descriptions.Item label="排序">{record.sortOrder}</Descriptions.Item>
        <Descriptions.Item label="启用">
          <Switch checked={!!record.isActive} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="标签">
          {record.tags?.length ? (
            <Space wrap>
              {record.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="资源地址" span={2}>
          {record.type === 'dynamic' ? record.videoUrl || '-' : record.url || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="缩略图地址" span={2}>
          {record.thumbnail || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{DayJS(record.createDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{DayJS(record.updateDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
)

export default WallpaperDetail
