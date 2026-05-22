import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './deviceVersion.less'
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
  Table
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DeviceVersionNew from './deviceVersionNew'
import DeviceVersionEdit from './deviceVersionEdit'
import { IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'
import { deviceVersionService } from '@/pages/deviceVersion/services'
import { deviceTypeOptions, filterDeviceType } from '@/utils'

interface Props {}

type FieldType = {
  deviceType?: string
  fileName?: string
  hardwareVersion?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const DeviceVersion: React.FC<Props> = (props) => {
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
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (value) => <span>{filterDeviceType(value)}</span>
    },
    {
      title: '固件文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (value) => <span>{value}</span>
    },
    {
      title: '固件版本',
      dataIndex: 'version',
      key: 'version',
      render: (value) => <span>{value}</span>
    },
    {
      title: '硬件版本',
      dataIndex: 'hardwareVersion',
      key: 'hardwareVersion',
      render: (value) => <span>{value}</span>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
          <Permission code="deviceVersion.list.delete">
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
    const { data } = await deviceVersionService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的设备版本列表', data)
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
    const data = await deviceVersionService.delete(value.id)
    if (data.code === '200') {
      message.success('删除设备版本成功')
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
    <div className={cn(styles.deviceVersion)}>
      <HeaderWrapper
        title="设备版本管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="设备类型"
            name="deviceType"
            rules={[{ required: false, message: '请选择设备类型' }]}
          >
            <Select
              placeholder="请选择设备类型"
              options={deviceTypeOptions}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="固件文件名"
            name="fileName"
            rules={[{ required: false, message: '请输入固件文件名' }]}
          >
            <Input placeholder="请输入固件文件名" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="硬件版本"
            name="hardwareVersion"
            rules={[{ required: false, message: '请输入硬件版本' }]}
          >
            <Input placeholder="请输入硬件版本" allowClear />
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

        <DeviceVersionNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <DeviceVersionEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default DeviceVersion
