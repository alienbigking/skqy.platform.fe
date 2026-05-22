import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './productManagement.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Popconfirm, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ProductManagementNew from './productManagementNew'
import {
  EShelfStatus,
  EUrgencyType,
  IPagination
} from '@/pages/common/types/common'
import { productManagementService } from '../services'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'
import ProductManagementEdit from './productManagementEdit'
import { filterEShelfStatus, filterProductType, formatPrice } from '@/utils'
import { filterUrgencyType } from '@/utils/filters'

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

const ProductManagement: React.FC<Props> = (props) => {
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
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: 'sku',
      dataIndex: 'sku',
      key: 'sku',
      render: (value) => <span>{value ? value : '--'}</span>
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (value) => <span>{formatPrice(value) + '元'}</span>
    },
    {
      title: '是否上架',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) =>
        value === EShelfStatus.listed ? (
          <Tag color="blue">{filterEShelfStatus(value)}</Tag>
        ) : (
          <Tag color="red">{filterUrgencyType(value)}</Tag>
        )
    },
    {
      title: '是否加急',
      dataIndex: 'urgencyType',
      key: 'urgencyType',
      render: (value) => (
        <span>
          {value === EUrgencyType.standard ? (
            <Tag color="green">{filterUrgencyType(value)}</Tag>
          ) : (
            <Tag color="gold">{filterUrgencyType(value)}</Tag>
          )}
        </span>
      )
    },
    {
      title: '商品类型',
      dataIndex: 'productType',
      key: 'productType',
      render: (value) => <span>{filterProductType(value)}</span>
    },

    {
      title: '所属产品类别',
      dataIndex: 'category',
      key: 'category',
      render: (value) => <span>{value?.name}</span>
    },
    {
      title: '简短描述',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      render: (value) => <span>{value}</span>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (value) => <span>{value}</span>
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
          <Permission code="productManagement.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="productManagement.list.delete">
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
    const { data } = await productManagementService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的商品列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [pagination])

  const onDelete = async (value: any) => {
    const data = await productManagementService.delete(value.id)
    if (data.code === '200') {
      message.success('删除商品成功')
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

  const onChangeState = (record: any) => {}
  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.productManagement)}>
      <HeaderWrapper
        title="商品管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="商品名称"
            name="name"
            rules={[{ required: false, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" allowClear />
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

        <ProductManagementNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <ProductManagementEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default ProductManagement
