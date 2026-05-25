import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './file.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, message, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { IPagination } from '@/pages/common/types/common'
import { fileService } from '../services'
import FileUpload from './fileUpload'
import { Permission } from '@/components/permission'

interface Props {}

type FieldType = {
  fileName?: string
  fileType?: string
}

interface FileItem {
  id: string
  fileName: string
  originalname: string
  filePath?: string
  fileType?: string
  fileSize?: number
  describe?: string
  createDate?: number
}

const formatFileSize = (size?: number) => {
  if (!size) return '-'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

const File: React.FC<Props> = () => {
  const [isVisibleUpload, setIsVisibleUpload] = useState(false)
  const [tableData, setTableData] = useState<FileItem[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [form] = Form.useForm()

  const columns: ColumnsType<FileItem> = [
    {
      title: '原始文件名',
      dataIndex: 'originalname',
      key: 'originalname',
      render: (value) => value || '-'
    },
    {
      title: '存储文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (value) => value || '-'
    },
    {
      title: '类型',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (value) => value || '-'
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (value) => formatFileSize(value)
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      render: (value) => value || '-'
    },
    {
      title: '上传时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 180,
      render: (value) => (value ? DayJS(value).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="file.list.download">
            <Button type="text" className={cn(['gGeneralTextButton'])} onClick={() => onDownload(record)}>
              下载
            </Button>
          </Permission>
          <Permission code="file.list.delete">
            <Popconfirm
              title="是否确认删除？"
              description="此操作会删除当前文件记录，您确定要删除吗？"
              onConfirm={() => onDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" className={cn(['gDeleteTextButton'])}>
                删除
              </Button>
            </Popconfirm>
          </Permission>
        </div>
      )
    }
  ]

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await fileService.getList({
      ...values,
      ...pagination
    })
    setTableData(data?.list || [])
    setTotal(data?.total || 0)
  }, [form, pagination])

  const onSearch = () => {
    setPagination({
      page: 1,
      pageSize: pagination.pageSize
    })
  }

  const onReset = () => {
    form.resetFields()
    setPagination({
      page: 1,
      pageSize: 10
    })
  }

  const onChangeTable = (pagination: any) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onDelete = async (record: FileItem) => {
    const response = await fileService.delete(record.id)
    if (response.status === 0) {
      message.success('删除文件成功')
      getList()
    } else {
      message.error(response.message || '删除文件失败')
    }
  }

  const onDownload = async (record: FileItem) => {
    const { status, data } = await fileService.getDownloadUrl(record.id)
    if (status === 0 && data?.downloadUrl) {
      window.open(data.downloadUrl, '_blank')
    } else {
      message.error('获取下载地址失败')
    }
  }

  const handleOk = () => {
    setIsVisibleUpload(false)
    getList()
  }

  return (
    <div className={cn(styles.file)}>
      <HeaderWrapper title="文件管理" form={form} onSearchCallback={onSearch} onResetCallback={onReset}>
        <Col span={6}>
          <Form.Item<FieldType> label="文件名" name="fileName">
            <Input placeholder="请输入文件名" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="文件类型" name="fileType">
            <Input placeholder="请输入文件类型" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="file.list.upload">
              <Button icon={<UploadOutlined />} className={cn(['gMainButton'])} type="primary" onClick={() => setIsVisibleUpload(true)}>
                上传
              </Button>
            </Permission>
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              onChange={onChangeTable}
              scroll={{ x: 'max-content' }}
              pagination={{
                total,
                current: pagination.page,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>
        <FileUpload isVisible={isVisibleUpload} handleOk={handleOk} handleCancel={() => setIsVisibleUpload(false)} />
      </ContentWrapper>
    </div>
  )
}

export default File
