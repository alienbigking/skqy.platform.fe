import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './organization.less'
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
  Table
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import OrganizationNew from './organizationNew'
import { IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import { organizationService } from '@/pages/organization/services'

import { Permission } from '@/components/permission'
import OrganizationEdit from './organizationEdit'
import PdfNumberNew from '@/pages/organization/components/pdfNumberNew'
import PdfNumberEdit from '@/pages/organization/components/pdfNumberEdit'
import PdfNumberRecordList from '@/pages/organization/components/pdfNumberRecordList'
import { hasPermission } from '@/utils/permission'
import AssignedDeviceList from '@/pages/organization/components/assignedDeviceList'

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

const Organization: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [isVisibleAssignedDeviceList, setIsVisibleAssignedDeviceList] =
    useState(false)
  const [isVisibleNewPdfNumber, setIsVisibleNewPdfNumber] = useState(false)
  const [isVisibleReducePdfNumber, setIsVisibleReducePdfNumber] =
    useState(false)
  const [isVisiblePdfNumberRecordList, setIsVisiblePdfNumberRecordList] =
    useState(false)
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: '邀请码',
      dataIndex: 'invitationCode',
      key: 'invitationCode',
      render: (value) => <span>{value}</span>
    },
    {
      title: '机构联系人',
      dataIndex: 'contact',
      key: 'contact',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '单位地址',
      dataIndex: 'address',
      key: 'address',
      width: 250,
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
      title: 'PDF报告数量',
      dataIndex: 'reportQuota',
      key: 'reportQuota',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '是否启用PDF报告数量',
      dataIndex: 'reportQuotaEnabled',
      key: 'reportQuotaEnabled',
      hidden: !hasPermission('organization.list.enablePdfNumber'),
      render: (value, record) => (
        <Permission code="organization.list.enablePdfNumber">
          <Switch
            checked={value}
            onChange={(state) => onEnable(state, record)}
          />
        </Permission>
      )
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
          <Permission code="organization.list.newPdfNumber">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onNewPdfNumber(value)}
            >
              新增PDF报告数量
            </Button>
          </Permission>
          <Permission code="organization.list.reducePdfNumber">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onReducePdfNumber(value)}
            >
              减少PDF报告数量
            </Button>
          </Permission>
          <Permission code="organization.list.recordPdfNumber">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onPdfNumberRecord(value)}
            >
              PDF报告数量操作记录
            </Button>
          </Permission>
          <Permission code="organization.list.rightsInterestsAssign">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onAssign(value)}
            >
              权益分配
            </Button>
          </Permission>
          <Permission code="organization.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="organization.list.delete">
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
    const { code, data } = await organizationService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的机构列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [pagination])

  const onDelete = async (value: any) => {
    const data = await organizationService.delete(value.id)
    if (data.code === '200') {
      message.success('删除机构成功')
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

  const onAssign = (value: any) => {
    console.log('分配设备', value)
    setIsVisibleAssignedDeviceList(true)
    setRowData(value)
  }

  const onNewPdfNumber = (value: any) => {
    console.log('新增PDF报告数量', value)
    setIsVisibleNewPdfNumber(true)
    setRowData(value)
  }

  const onReducePdfNumber = (value: any) => {
    console.log('减少PDF报告数量', value)
    setIsVisibleReducePdfNumber(true)
    setRowData(value)
  }

  const onPdfNumberRecord = (value: any) => {
    console.log('PDF报告数量操作记录', value)
    setIsVisiblePdfNumberRecordList(true)
    setRowData(value)
  }

  const onEnable = async (state: boolean, value: any) => {
    console.log('账号是否启用', state, value)
    const data = await organizationService.updatePdfNumberEnabledState({
      id: value.id,
      enabled: state
    })
    if (data.code === '200') {
      message.success('操作成功')
      getList()
    }
  }

  const handleOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    setIsVisibleAssignedDeviceList(false)
    setIsVisibleNewPdfNumber(false)
    setIsVisibleReducePdfNumber(false)
    setIsVisiblePdfNumberRecordList(false)
    getList()
  }

  return (
    <div className={cn(styles.organization)}>
      <HeaderWrapper
        title="机构管理"
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
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <AssignedDeviceList
          rowData={rowData}
          isVisible={isVisibleAssignedDeviceList}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleAssignedDeviceList(false)}
        />

        <OrganizationNew
          isVisible={isVisibleNew}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <OrganizationEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />

        <PdfNumberNew
          rowData={rowData}
          isVisible={isVisibleNewPdfNumber}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleNewPdfNumber(false)}
        />

        <PdfNumberEdit
          rowData={rowData}
          isVisible={isVisibleReducePdfNumber}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleReducePdfNumber(false)}
        />

        <PdfNumberRecordList
          rowData={rowData}
          isVisible={isVisiblePdfNumberRecordList}
          handleOk={handleOk}
          handleCancel={() => setIsVisiblePdfNumberRecordList(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default Organization
