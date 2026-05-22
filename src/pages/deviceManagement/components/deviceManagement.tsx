import React, { Fragment, useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './deviceManagement.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Table
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DeviceManagementNew from './deviceManagementNew'
import { IPagination } from '@/pages/common/types/common'
import { deviceManagementService } from '@/pages/deviceManagement/services'
import DayJS from 'dayjs'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'
import DeviceManagementEdit from '@/pages/deviceManagement/components/deviceManagementEdit'
import { filterDeviceType } from '@/utils'

interface Props {}

type FieldType = {
  sn?: string
  boundDeviceSn?: string
  username?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const DeviceManagement: React.FC<Props> = (props) => {
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

  const [modal, contextHolder] = Modal.useModal()
  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (value) => <span>{filterDeviceType(value)}</span>
    },
    {
      title: 'SN码',
      dataIndex: 'sn',
      key: 'sn',
      render: (value) => <span>{value}</span>
    },
    {
      title: '绑定的设备SN码',
      dataIndex: 'boundDeviceSn',
      key: 'boundDeviceSn',
      render: (value) => <span>{value}</span>
    },
    {
      title: '所属机构',
      dataIndex: 'organization',
      key: 'organization',
      render: (value, record) => (
        <div>
          <span> {value?.name ? value.name : '--'}</span>
        </div>
      )
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
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
          {value.boundDeviceSn && (
            <Permission code="deviceManagement.list.unbind">
              <Button
                type="text"
                className={cn(['gGeneralTextButton'])}
                onClick={() => onUnbind(value)}
              >
                解绑
              </Button>
            </Permission>
          )}

          <Permission code="deviceManagement.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>

          <Permission code="deviceManagement.list.delete">
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
    const { data } = await deviceManagementService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的设备列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [pagination])

  const onDelete = async (value: any) => {
    const data = await deviceManagementService.delete(value.id)
    if (data.code === '200') {
      message.success('删除设备成功')
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

  const onUnbind = (value: any) => {
    console.log('解绑了', value)
    modal.confirm({
      title: '是否确认解绑',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Fragment>
          <div>
            确定解绑SN码【{value.sn}】和绑定的设备SN码【{value.boundDeviceSn}
            】吗？
          </div>
          <div style={{ color: '#ff0000' }}>
            注意：解绑操作需要在4G网关关机状态下才能完成。
          </div>
        </Fragment>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.log('确认了')
        const { code, msg } = await deviceManagementService.unbind(value.id)
        if (code === '200') {
          message.success('解绑成功')
          getList()
        } else {
          message.error(msg)
        }
      },
      onCancel: () => {}
    })
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
    <div className={cn(styles.deviceManagement)}>
      {contextHolder}
      <HeaderWrapper
        title="设备管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="SN码"
            name="sn"
            rules={[{ required: false, message: '请输入SN码' }]}
          >
            <Input placeholder="请输入SN码" allowClear />
          </Form.Item>
        </Col>
        {/*<Col span={6}>*/}
        {/*  <Form.Item<FieldType>*/}
        {/*    label="绑定的设备SN码"*/}
        {/*    name="boundDeviceSn"*/}
        {/*    rules={[{ required: false, message: '请输入绑定的设备SN码' }]}*/}
        {/*  >*/}
        {/*    <Input placeholder="请输入绑定的设备SN码" allowClear />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}
        <Col span={6}>
          <Form.Item<FieldType>
            label="用户名"
            name="username"
            rules={[{ required: false, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
        </Col>
        {/*<Col span={6}>*/}
        {/*  <Form.Item<FieldType>*/}
        {/*    label="绑定的设备SN"*/}
        {/*    name="boundDeviceSn"*/}
        {/*    rules={[{ required: false, message: '请输入绑定的设备SN' }]}*/}
        {/*  >*/}
        {/*    <Input placeholder="请输入绑定的设备SN" allowClear />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="deviceManagement.list.new">
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
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <DeviceManagementNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <DeviceManagementEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default DeviceManagement
