import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './appUser.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, Form, Input, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { appUserService } from '../services'
import DayJS from 'dayjs'
import { Permission } from '@/components/permission'
import { calculateAge, gender } from '@/utils'
import GivenReportNumber from '@/pages/appUser/components/givenReportNumber'
import AppUserEdit from '@/pages/appUser/components/appUserEdit'

interface Props {}

type FieldType = {
  nickname?: string
  mobile?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const AppUser: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleGivenReportNumber, setIsVisibleGivenReportNumber] =
    useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [isOpen, setIsOpen] = useState(false)
  const [givenReportType, setGivenReportType] = useState(1)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
        </div>
      )
    },
    {
      title: '所属机构',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
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
      title: '身高',
      dataIndex: 'height',
      key: 'height',
      render: (value, record) => (
        <div>
          <span> {value ? value + 'cm' : '--'}</span>
        </div>
      )
    },
    {
      title: '体重',
      dataIndex: 'weight',
      key: 'weight',
      render: (value, record) => (
        <div>
          <span> {value ? value + 'kg' : '--'}</span>
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
      width: 280,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="appUser.list.given.aiReportNumber">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="appUser.list.given.aiReportNumber">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onGivenAiReportNumber(value)}
            >
              赠送AI报告
            </Button>
          </Permission>
          <Permission code="appUser.list.given.dynamicReportNumber">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onGivenDynamicReportNumber(value)}
            >
              赠送动态报告
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
    const { code, data, msg } = await appUserService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的App用户列表', data)

    if (code !== '200') {
      message.error(msg)
      return
    }

    setTableData(
      data?.list?.map((item: any) => {
        item.isOpen = false
        return item
      })
    )
    setTotal(data?.total)
  }, [pagination])

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

  const onEdit = (value: any) => {
    setRowData(value)
    setIsVisibleEdit(true)
  }
  const onGivenAiReportNumber = (value: any) => {
    setIsVisibleGivenReportNumber(true)
    setRowData(value)
    setGivenReportType(1)
  }

  const onGivenDynamicReportNumber = (value: any) => {
    setIsVisibleGivenReportNumber(true)
    setRowData(value)
    setGivenReportType(2)
  }

  const handleNewOk = () => {
    setIsVisibleGivenReportNumber(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.appUser)}>
      <HeaderWrapper
        title="app用户管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="姓名"
            name="nickname"
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
        <GivenReportNumber
          type={givenReportType}
          isVisible={isVisibleGivenReportNumber}
          rowData={rowData}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleGivenReportNumber(false)}
        />
        <AppUserEdit
          isVisible={isVisibleEdit}
          rowData={rowData}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default AppUser
