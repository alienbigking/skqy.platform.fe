import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './liveActive.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import LiveActiveNew from './liveActiveNew'
import LiveActiveDetail from './liveActiveDetail'
import { IPagination } from '@/pages/common/types/common'
import { liveActiveService } from '@/pages/liveActive/services'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import { gender, storage } from '@/utils'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { env } from '@/config/env'
import { cloneDeep } from 'lodash'

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

const LiveActive: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleDetail, setIsVisibleDetail] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [socketUrl, setSocketUrl] = useState(
    `${env.WSS_URL}realtime-messaging/?token=${storage.getSession('token')}`
  )
  const [messageHistory, setMessageHistory] = useState([])

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  } = useWebSocket(
    `${env.WSS_URL}realtime-messaging/?token=${storage.getSession('token')}`,
    {
      onOpen: (event) => {
        console.log('WebSocket 打开了', event)
      },
      onMessage: (event) => {
        const values = JSON.parse(event.data)
        const data = cloneDeep(tableData)
        console.log('WebSocket 接收到消息', values)

        if (data.length < 10) {
          if (data.length === 0) {
            data.push({
              ...values.content,
              createAt: values.timestamp,
              conclusion: values?.content?.summary[0]?.short
            })
          } else {
            data?.forEach((item: any, index) => {
              if (values.content.userId === item.userId) {
                data.splice(index, 1)
              }
              data.push({
                ...values.content,
                createAt: values.timestamp,
                conclusion: values?.content?.summary[0]?.short
              })
            })
          }
        } else {
          data.shift()
        }

        setTableData(data)
        // setTotal(data.total)
      },
      onClose: (event) => {
        console.log('WebSocket 关闭了', event)
      },
      onError: (error) => {
        console.error('WebSocket 错误', error)
      }
    }
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState]

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (value) => <span>{gender(value)}</span>
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '当前状态',
      dataIndex: 'conclusion',
      key: 'conclusion',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="liveActive.list.detail">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onDetail(value)}
            >
              详情
            </Button>
          </Permission>
          {/*<Permission code="role.list.delete">*/}
          {/*  <Popconfirm*/}
          {/*    title="是否确认删除？"*/}
          {/*    description="此操作会将当前的数据删除，您确定要删除吗？"*/}
          {/*    onConfirm={() => onDelete(value)}*/}
          {/*    okText="确定"*/}
          {/*    cancelText="取消"*/}
          {/*  >*/}
          {/*    <Button type="text" className={cn(['gDeleteTextButton'])}>*/}
          {/*      删除*/}
          {/*    </Button>*/}
          {/*  </Popconfirm>*/}
          {/*</Permission>*/}
        </div>
      )
    }
  ]

  useEffect(() => {
    if (pagination) {
      getList()
      console.log(
        '获取的socket地址及对象',
        `${env.WSS_URL}realtime-messaging/?token=${storage.getSession(
          'token'
        )}`,
        getWebSocket()
      )
    }
  }, [pagination])

  const getList = async () => {
    const values = form.getFieldsValue()
    const data = cloneDeep(tableData)
    data.forEach((item: any) => {})
    console.log('搜索内容', values)

    // const { data } = await liveActiveService.getList({
    //   ...values,
    //   ...pagination
    // })
    // console.log('获取的实时数据列表', data)
    // setTableData(data.list)
    // setTotal(data.total)
  }

  const onDelete = async (value: any) => {
    const data = await liveActiveService.delete(value.id)
    if (data.code === '200') {
      message.success('删除角色成功')
      getList()
    }
  }
  const onSearch = (values: any) => {
    getList()
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

  const onDetail = (value: any) => {
    setIsVisibleDetail(true)
    setRowData(value)
  }

  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleDetail(false)
    getList()
  }

  return (
    <div className={cn(styles.liveActive)}>
      <HeaderWrapper
        title="实时活跃"
        form={form}
        isHideSearch={true}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="姓名"
            name="name"
            rules={[{ required: false, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" allowClear />
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
              pagination={false}
              // pagination={{
              //   total: total,
              //   showSizeChanger: true,
              //   showQuickJumper: true
              //   // showTotal: (total) => `总计${total}条`
              // }}
            />
          </div>
        </div>

        <LiveActiveNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <LiveActiveDetail
          rowData={rowData}
          isVisible={isVisibleDetail}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleDetail(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default LiveActive
