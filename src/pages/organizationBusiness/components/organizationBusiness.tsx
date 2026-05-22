import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './organizationBusiness.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import OrganizationBusinessNew from './organizationBusinessNew'
import { IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import OrganizationBusinessEdit from './organizationBusinessEdit'
import { organizationBusinessService } from '@/pages/organizationBusiness/services'
import { Permission } from '@/components/permission'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const OrganizationBusiness: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '业务名称',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: '健康报告表头',
      dataIndex: 'header',
      key: 'header',
      render: (value) => <span>{value}</span>
    },
    {
      title: '关联机构',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (value) => <span>{value}</span>
    },
    {
      title: '内部业务类型',
      dataIndex: 'innerBusinessName',
      key: 'innerBusinessName',
      render: (value) => <span>{value}</span>
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="organizationBusiness.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="organizationBusiness.list.delete">
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
    const { data } = await organizationBusinessService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的机构业务列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [pagination])

  const getOrganizationsText = (value: any[]) => {
    return value?.map((item: any, index: number) => (
      <span key={item.id}>
        {item.name + (index < value.length - 1 ? '、' : '')}
      </span>
    ))
  }

  const onDelete = async (value: any) => {
    const data = await organizationBusinessService.delete(value.id)
    if (data.code === '200') {
      message.success('删除机构业务配置成功')
      getList()
    }
  }
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

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters)
    setPagination({
      pageNum: pagination.current,
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
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.menu)}>
      <HeaderWrapper
        title="机构业务"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="业务名称"
            name="name"
            rules={[{ required: false, message: '请输入业务名称' }]}
          >
            <Input placeholder="请输入业务名称" allowClear />
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
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <OrganizationBusinessNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <OrganizationBusinessEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default OrganizationBusiness
