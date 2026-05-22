import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './internalProduct.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import InternalProductNew from './internalProductNew'
import { IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'
import { internalProductService } from '../services'
import InternalProductEdit from './internalProductEdit'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface DataType {
  name: string
  healthReportType: string
  organizations: string
  remark: string
  createAt: string
}

interface QueryParams {
  pagination: IPagination
  filters?: Record<string, any>
}

const InternalProduct: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState<QueryParams>({
    pagination: {
      pageNum: 1,
      pageSize: 10
    },
    filters: {}
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
      dataIndex: 'organization',
      key: 'organization',
      width: 250,
      ellipsis: true,
      render: (value) => <span>{value?.name}</span>
    },
    {
      title: '关联产品',
      dataIndex: 'product',
      key: 'product',
      width: 250,
      ellipsis: true,
      render: (value) => <span>{value?.name}</span>
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
          <Permission code="internalProduct.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="internalProduct.list.delete">
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
  }, [queryParams])

  const getList = useCallback(async () => {
    // const values = form.getFieldsValue()
    const { pagination, filters } = queryParams

    const { data } = await internalProductService.getList({
      ...filters,
      ...pagination
    })
    console.log('获取的机构产品列表', data)
    setTableData(data?.list)
    setTotal(data?.total)
  }, [queryParams])

  const onDelete = async (value: any) => {
    const data = await internalProductService.delete(value.id)
    if (data.code === '200') {
      message.success('删除机构产品成功')
      getList()
    }
  }
  const onSearch = (values: any) => {
    console.log('搜索参数', values)
    setQueryParams((prev) => ({
      ...prev,
      filters: values,
      pagination: { ...prev.pagination, pageNum: 1 }
    }))
  }

  const onReset = () => {
    setQueryParams({
      pagination: {
        pageNum: 1,
        pageSize: 10
      },
      filters: {}
    })
  }

  const onChangeTable = (tablePagination: any, filters: any) => {
    console.log('分页', tablePagination, filters)
    setQueryParams((prev) => ({
      ...prev,
      pagination: {
        pageNum: tablePagination.current,
        pageSize: tablePagination.pageSize
      }
    }))
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
    <div className={cn(styles.internalProduct)}>
      <HeaderWrapper
        title="机构产品"
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
                current: queryParams.pagination.pageNum,
                pageSize: queryParams.pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <InternalProductNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <InternalProductEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default InternalProduct
