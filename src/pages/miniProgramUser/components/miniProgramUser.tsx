import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './miniProgramUser.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { miniProgramUserService } from '../services'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import { calculateAge, gender } from '@/utils'
import MiniProgramUserHistory from './miniProgramUserHistory'
import { PlusOutlined } from '@ant-design/icons'
import MiniProgramUserNew from './miniProgramUserNew'
import { filterPlatformSourceType } from '@/utils/filters'
import MiniProgramUserEdit from '@/pages/miniProgramUser/components/miniProgramUserEdit'
import Bind from '@/pages/miniProgramUser/components/bind'

interface Props {}

type FieldType = {
  username?: string
  mobile?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const MiniProgramUser: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [isVisibleBind, setIsVisibleBind] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [isOpen, setIsOpen] = useState(false)

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
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
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (value, record) => (
        <div>
          <span> {calculateAge(value)}</span>
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
      title: '所属机构',
      dataIndex: 'organization',
      key: 'organization',
      render: (value, record) => (
        <div>
          <span> {value.name ? value.name : '--'}</span>
        </div>
      )
    },
    {
      title: '报告服务剩余次数',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '平台来源',
      dataIndex: 'platform',
      key: 'platform',
      render: (value, record) => (
        <div>
          <span> {filterPlatformSourceType(value)}</span>
        </div>
      )
    },
    {
      title: '家庭地址',
      dataIndex: 'address',
      key: 'address',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
        </div>
      )
    },
    {
      title: '紧急联系人',
      dataIndex: 'emergencyContact',
      key: 'emergencyContact',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
        </div>
      )
    },
    {
      title: '联系人手机',
      dataIndex: 'emergencyContactMobile',
      key: 'emergencyContactMobile',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
        </div>
      )
    },
    {
      title: '其他',
      dataIndex: 'userNotes',
      key: 'userNotes',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
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
      width: 300,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="miniProgramUser.list.bind">
            {value.platform === 6 && (
              <Button
                type="text"
                className={cn(['gGeneralTextButton'])}
                onClick={() => onBind(value)}
                disabled={!!value.sn && !!value.boxSn}
              >
                绑定
              </Button>
            )}
          </Permission>
          <Permission code="miniProgramUser.list.unbind">
            <Popconfirm
              title="是否确认解绑？"
              description="此操作会解绑当前用户的设备，您确定要解绑吗？"
              onConfirm={() => onUnbind(value)}
              okText="确定"
              cancelText="取消"
            >
              {value.platform === 6 && (
                <Button
                  type="text"
                  className={cn(['gGeneralTextButton'])}
                  disabled={!value.sn && !value.boxSn}
                >
                  解绑
                </Button>
              )}
            </Popconfirm>
          </Permission>
          <Permission code="miniProgramUser.list.edit">
            {value.platform === 6 && (
              <Button
                type="text"
                className={cn(['gGeneralTextButton'])}
                onClick={() => onEdit(value)}
              >
                编辑
              </Button>
            )}
          </Permission>
          <Permission code="miniProgramUser.list.history">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onHistory(value)}
            >
              历史检测记录
            </Button>
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
    const { data } = await miniProgramUserService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的小程序用户列表', data)
    setTableData(
      data.list.map((item: any) => {
        item.isOpen = false
        return item
      })
    )
    setTotal(data.total)
  }, [pagination])

  const onDelete = async (value: any) => {
    const data = await miniProgramUserService.delete(value.id)
    if (data.code === '200') {
      message.success('删除小程序用户成功')
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
    form.resetFields()
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

  const onHistory = (value: any) => {
    setIsVisibleHistory(true)
    setRowData(value)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }
  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleHistory(false)
    setIsVisibleEdit(false)
    setIsVisibleBind(false)
    getList()
  }

  const onNew = () => {
    setIsVisibleNew(true)
  }

  const onBind = async (value: any) => {
    setIsVisibleBind(true)
    setRowData(value)
  }

  const onUnbind = async (value: any) => {
    const { code, data, msg } = await miniProgramUserService.unbind({
      id: value.id
    })

    if (code === '200') {
      message.success('设备解绑成功')
      getList()
    } else {
      message.error(msg)
    }
  }

  return (
    <div className={cn(styles.miniProgramUser)}>
      <HeaderWrapper
        title="监测用户管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="姓名"
            name="username"
            rules={[{ required: false, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="手机号码"
            name="mobile"
            rules={[{ required: false, message: '请输入手机号码' }]}
          >
            <Input placeholder="请输入手机号码" allowClear />
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
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <MiniProgramUserNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <MiniProgramUserEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
        <Bind
          rowData={rowData}
          isVisible={isVisibleBind}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleBind(false)}
        />

        <MiniProgramUserHistory
          rowData={rowData}
          isVisible={isVisibleHistory}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleHistory(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default MiniProgramUser
