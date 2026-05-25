import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './menu.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Switch,
  Table,
  Tag
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import MenuNew from './menuNew'
import { menuService } from '@/pages/menu/services'
import { IPagination } from '@/pages/common/types/common'
import MenuEdit from '@/pages/menu/components/menuEdit'
import { PlusOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'
import { filterPageType } from '@/utils'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface MenuItem {
  id: string
  pid: string
  name: string
  type: number
  sort: number
  url: string
  icon?: string
  isActive?: boolean
  children?: MenuItem[]
}

const Menu: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<MenuItem[]>([])
  const [statusLoadingId, setStatusLoadingId] = useState('')
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10
  })
  const [form] = Form.useForm()

  const columns: ColumnsType<MenuItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (value) =>
        value === 0 ? (
          <Tag color="orange">{filterPageType(value)}</Tag>
        ) : (
          <Tag color="green">{filterPageType(value)}</Tag>
        )
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value, record) => (
        <Switch
          checked={value !== false}
          loading={statusLoadingId === record.id}
          onChange={(checked) => onChangeStatus(record, checked)}
        />
      )
    },
    {
      title: '路由',
      dataIndex: 'url',
      key: 'url',
      render: (value) => value || '-'
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 250,
      render: (_, value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="menu.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="menu.list.delete">
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
    const { data } = await menuService.getList({
      ...values,
      ...pagination,
      tree: true
    })

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

  const onNew = () => {
    setIsVisibleNew(true)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }

  const onDelete = async (value: any) => {
    const data = await menuService.delete(value.id)
    if (data.status === 0) {
      message.success('删除菜单成功')
      getList()
    } else {
      message.error(data.message || '删除菜单失败')
    }
  }

  const onChangeStatus = async (value: MenuItem, checked: boolean) => {
    setStatusLoadingId(value.id)
    const response = await menuService.update({
      ...value,
      isActive: checked
    })

    if (response.status === 0) {
      message.success(checked ? '已启用菜单' : '已禁用菜单')
      getList()
    } else {
      message.error(response.message || '更新菜单状态失败')
    }
    setStatusLoadingId('')
  }

  const handleNewOk = () => {
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.menu)}>
      <HeaderWrapper
        title="菜单栏配置"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="名称"
            name="name"
            rules={[{ required: false, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" allowClear />
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
        <MenuNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />
        <MenuEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default Menu
