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
import {
  accountOptions,
  filterAccountStatus,
  gender,
  hasPermission
} from '@/utils'
import {
  EAccountStatus,
  IAnyKey,
  IPagination
} from '@/pages/common/types/common'
import { userService } from '@/pages/user/services'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import UserAssign from './userAssign'

interface Props {}

type FieldType = {
  nickname?: string
  mobile?: string
  email?: string
  status?: EAccountStatus
}

const User: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<IAnyKey[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [isVisibleAssign, setIsVisibleAssign] = useState<boolean>(false)

  const [form] = Form.useForm()

  const columns: ColumnsType<IAnyKey> = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (value) => <span>{value}</span>
    },
    {
      hidden: !hasPermission('user.list.invitationCode'),
      title: '邀请码',
      dataIndex: 'invitationCode',
      key: 'invitationCode',
      render: (value) => <span>{value}</span>
    },
    {
      title: '所属机构',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (value) => <span>{value}</span>
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
      render: (value) => <span>{gender(value)}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <div>{filterAccountStatus(value)}</div>
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
          <Permission code="user.list.assign">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onAssign(value)}
            >
              分配小程序用户
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
    setTableData(data?.list)
    setTotal(data?.total)
  }, [pagination])

  const onSearch = (values: any) => {
    setPagination({
      pageNum: 1,
      pageSize: pagination.pageSize
    })
  }
  const onReset = () => {
    setPagination({
      pageNum: 1,
      pageSize: 10
    })
  }

  const onNew = () => {
    setIsVisibleNew(true)
  }

  const onAssign = (value: any) => {
    setRowData(value)
    setIsVisibleAssign(true)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }

  const onDetail = () => {}

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters)
    setPagination({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onDelete = async (value: any) => {
    console.log('点击删除了', value)
    const data = await userService.delete(value.id)
    if (data.code === '200') {
      message.success('删除菜单成功')
      getList()
    }
  }

  const onEnable = async (state: boolean, value: any) => {
    console.log('账号是否启用', state, value)
    const data = state
      ? await userService.enable(value.id)
      : await userService.disabled(value.id)
    if (data.code === '200') {
      message.success(state ? '启用成功' : '禁用成功')
      getList()
    }
  }
  const onSelectState = () => {}

  const handleNewOk = () => {
    console.log('操作成功')
    // setIsVisibleNew(false)
    setIsVisibleEdit(false)
    setIsVisibleAssign(false)
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
              onChange={onSelectState}
              options={accountOptions}
              placeholder="请选择账号状态"
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            {/*<Button*/}
            {/*  icon={<PlusOutlined />}*/}
            {/*  className={cn(['gMainButton'])}*/}
            {/*  type="primary"*/}
            {/*  onClick={onNew}*/}
            {/*>*/}
            {/*  新增*/}
            {/*</Button>*/}
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
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        {/*<UserNew*/}
        {/*  isVisible={isVisibleNew}*/}
        {/*  handleOk={() => setIsVisibleNew(false)}*/}
        {/*  handleCancel={() => setIsVisibleNew(false)}*/}
        {/*/>*/}

        <UserEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
        <UserAssign
          rowData={rowData}
          isVisible={isVisibleAssign}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleAssign(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default User
