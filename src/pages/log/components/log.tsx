import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './log.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { roleService } from '@/pages/role/services'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { logService } from '@/pages/log/services'
import { parseClient } from '@/utils'

interface Props {}

type FieldType = {
  reUser?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const Log: React.FC<Props> = (props) => {
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
      title: '操作者',
      dataIndex: 'reUser',
      key: 'reUser',
      width: 180,
      render: (value) => <span>{value}</span>
    },
    {
      title: 'IP地址',
      dataIndex: 'reIp',
      key: 'reIp',
      width: 180,
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '请求类型',
      dataIndex: 'reMethod',
      key: 'reMethod',
      width: 180,
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '请求路径',
      dataIndex: 'reUrl',
      key: 'reUrl',
      render: (value, record) => <div>{value}</div>
    },
    {
      title: '请求时间',
      dataIndex: 'reTime',
      key: 'reTime',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
    {
      title: '客户端类型',
      dataIndex: 'userAgent',
      key: 'userAgent',
      width: 180,
      render: (value, record) => (
        <div>
          <span> {parseClient(value).name}</span>
        </div>
      )
    }
  ]

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await logService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的日志列表', data)
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
    const data = await roleService.delete(value.id)
    if (data.code === '200') {
      message.success('删除日志成功')
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
    <div className={cn(styles.log)}>
      <HeaderWrapper
        title="日志管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="操作人"
            name="reUser"
            rules={[{ required: false, message: '请输入操作人' }]}
          >
            <Input placeholder="请输入操作人" allowClear />
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
      </ContentWrapper>
    </div>
  )
}

export default Log
