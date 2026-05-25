import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './role.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Popconfirm, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import RoleNew from './roleNew'
import RoleEdit from '@/pages/role/components/roleEdit'
import { IPagination } from '@/pages/common/types/common'
import { roleService } from '@/pages/role/services'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface RoleItem {
  id: string
  name: string
  roleCode?: string
  remark?: string
  permissions?: any[]
  organizations?: any[]
  createAt?: number
}

const Role: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<RoleItem[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  const columns: ColumnsType<RoleItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      render: (value) => value || '-'
    },
    {
      title: '关联机构',
      dataIndex: 'organizations',
      key: 'organizations',
      width: 250,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="top" title={getNamesText(value)}>
          <span className={cn(styles.tableText)}>{getNamesText(value)}</span>
        </Tooltip>
      )
    },
    {
      title: '关联权限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 250,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="top" title={getNamesText(value)}>
          <span className={cn(styles.tableText)}>
            {getNamesText(value)}
          </span>
        </Tooltip>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (value) => value || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value, record) => (
        <div>{value ? DayJS(value).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="role.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="role.list.delete">
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
    const { data } = await roleService.getList({
      ...values,
      ...pagination
    })
    setTableData(data?.list || [])
    setTotal(data?.total || 0)
  }, [form, pagination])

  const getNamesText = (value: any[] = []) => {
    if (!value.length) return '-'
    return value.map((item: any) => item.name).join('、')
  }

  const onDelete = async (value: any) => {
    const data = await roleService.delete(value.id)
    if (data.status === 0) {
      message.success('删除角色成功')
      getList()
    } else {
      message.error(data.message || '删除角色失败')
    }
  }
  const onSearch = (values: any) => {
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

  const onChangeTable = (pagination: any, filters: any) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onNew = () => {
    setIsVisibleNew(true)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }

  const handleNewOk = () => {
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.role)}>
      <HeaderWrapper
        title="角色管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="角色名"
            name="name"
            rules={[{ required: false, message: '请输入角色名' }]}
          >
            <Input placeholder="请输入角色名" allowClear />
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
              onClick={onNew}
            >
              新增
            </Button>
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              onChange={onChangeTable}
              // sticky={true}
              scroll={{ x: 'max-content' }}
              pagination={{
                total: total,
                current: pagination.page,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <RoleNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <RoleEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default Role
