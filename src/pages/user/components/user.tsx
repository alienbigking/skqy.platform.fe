import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './user.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Switch,
  Table
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import UserEdit from './userEdit'
import { gender } from '@/utils'
import { IAnyKey, IPagination } from '@/pages/common/types/common'
import { userService } from '@/pages/user/services'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import UserNew from './userNew'
import UserRoleAssign from './userRoleAssign'
import { PlusOutlined } from '@ant-design/icons'

interface Props {}

type FieldType = {
  nickname?: string
  mobile?: string
  email?: string
  status?: string
}

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' }
]

const statusTextMap: Record<string, string> = {
  enabled: '启用',
  disabled: '禁用'
}

const User: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [isVisibleRoleAssign, setIsVisibleRoleAssign] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<IAnyKey[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  const columns: ColumnsType<IAnyKey> = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (value) => <span>{value}</span>
    },
    {
      title: '登录账号',
      dataIndex: 'userIdentifier',
      key: 'userIdentifier',
      render: (value) => <span>{value || '-'}</span>
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (value) => <span>{value}</span>
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value) => <span>{value}</span>
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (value) => <span>{gender(Number(value))}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <div>{statusTextMap[value] || '-'}</div>
    },
    {
      title: '是否激活',
      dataIndex: 'active',
      key: 'active',
      render: (value, record) => (
        <Switch
          checked={value !== 1}
          onChange={(state) => onEnable(state, record)}
        />
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (value) => <span>{value}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value) => (
        <span>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 250,
      render: (_, value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="user.list.role.assign">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onRoleAssign(value)}
            >
              分配角色
            </Button>
          </Permission>
          <Permission code="user.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="user.list.delete">
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
    console.log('查询表单内容', values, pagination)
    const { data } = await userService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的用户列表', data)
    setTableData(data?.list || [])
    setTotal(data?.total || 0)
  }, [form, pagination])

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

  const onNew = () => {
    setIsVisibleNew(true)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }

  const onRoleAssign = (value: any) => {
    setRowData(value)
    setIsVisibleRoleAssign(true)
  }

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters)
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onDelete = async (value: any) => {
    console.log('点击删除了', value)
    const data = await userService.delete(value.id)
    if (data.status === 0) {
      message.success('删除用户成功')
      getList()
    }
  }

  const onEnable = async (state: boolean, value: any) => {
    console.log('账号是否启用', state, value)
    const data = state
      ? await userService.enable(value.id)
      : await userService.disabled(value.id)
    if (data.status === 0) {
      message.success(state ? '启用成功' : '禁用成功')
      getList()
    }
  }
  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    setIsVisibleRoleAssign(false)
    getList()
  }

  return (
    <div className={cn(styles.user)}>
      <HeaderWrapper
        title="用户管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="昵称"
            name="nickname"
            rules={[{ required: false, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="手机号"
            name="mobile"
            rules={[{ required: false, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[{ required: false, message: '请输入邮箱' }]}
          >
            <Input placeholder="请输入邮箱" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="账号状态"
            name="status"
            rules={[{ required: false, message: '请选择账号状态' }]}
          >
            <Select
              options={statusOptions}
              placeholder="请选择账号状态"
              allowClear
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="user.list.create">
              <Button
                icon={<PlusOutlined />}
                className={cn(['gMainButton'])}
                type="primary"
                onClick={onNew}
              >
                新增
              </Button>
            </Permission>
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

        <UserNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <UserEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
        <UserRoleAssign
          rowData={rowData}
          isVisible={isVisibleRoleAssign}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleRoleAssign(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default User
