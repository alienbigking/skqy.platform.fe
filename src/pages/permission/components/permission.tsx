import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './permission.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, message, Popconfirm, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { permissionService } from '../services'
import PermissionNew from './permissionNew'
import PermissionEdit from './permissionEdit'

interface Props {}

type FieldType = {
  name?: string
  code?: string
}

interface PermissionItem {
  id: string
  parentId?: string
  name: string
  code: string
  ordinal?: number
  description?: string
  createDate?: number
  children?: PermissionItem[]
}

const Permission: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<PermissionItem[]>([])
  const [form] = Form.useForm()

  const columns: ColumnsType<PermissionItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '排序',
      dataIndex: 'ordinal',
      key: 'ordinal',
      width: 100,
      render: (value) => value ?? 0
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="top" title={value || '-'}>
          <span className={cn(styles.tableText)}>{value || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 180,
      render: (value) => (value ? DayJS(value).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Button
            type="text"
            className={cn(['gGeneralTextButton'])}
            onClick={() => onEdit(value)}
          >
            编辑
          </Button>
          <Popconfirm
            title="是否确认删除？"
            description="此操作会将当前的数据删除，您确定要删除吗？"
            onConfirm={() => onDelete(value)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" className={cn(['gDeleteTextButton'])}>
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await permissionService.getList({
      ...values,
      tree: true
    })
    setTableData(data?.list || [])
  }, [form])

  const onDelete = async (value: PermissionItem) => {
    const response = await permissionService.delete(value.id)
    if (response.status === 0) {
      message.success('删除权限成功')
      getList()
    } else {
      message.error(response.message || '删除权限失败')
    }
  }

  const onSearch = () => {
    getList()
  }

  const onReset = () => {
    form.resetFields()
    getList()
  }

  const onEdit = (value: PermissionItem) => {
    setRowData(value)
    setIsVisibleEdit(true)
  }

  const handleOk = () => {
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.permission)}>
      <HeaderWrapper
        title="权限管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType> label="名称" name="name">
            <Input placeholder="请输入名称" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="编码" name="code">
            <Input placeholder="请输入编码" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Button
              icon={<PlusOutlined />}
              className={cn(['gMainButton'])}
              type="primary"
              onClick={() => setIsVisibleNew(true)}
            >
              新增
            </Button>
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </div>
        </div>
        <PermissionNew
          isVisible={isVisibleNew}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleNew(false)}
        />
        <PermissionEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default Permission
