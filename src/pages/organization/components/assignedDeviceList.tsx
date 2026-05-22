import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Table
} from 'antd'
import cn from 'classnames'
import styles from './assignedDeviceList.less'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { organizationService } from '../services'
import { HeaderWrapper } from '@/components/headerWrapper'
import DeviceAssignList from '@/pages/organization/components/deviceAssignList'
import { useSetRecoilState } from 'recoil'
import { organizationStore } from '../stores'
import { filterDeviceType } from '@/utils'
import { Permission } from '@/components/permission'
import DeviceAssignEdit from '@/pages/organization/components/deviceAssignEdit'

type FieldType = {
  sn?: string
}

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

interface DataType {
  [key: string]: any
}

interface QueryParams {
  pagination: IPagination
  filters?: Record<string, any>
}

const AssignedDeviceList: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<DataType[]>([])
  const [isVisibleDeviceAssignList, setIsVisibleDeviceAssignList] =
    useState(false)
  const setRowDataStore = useSetRecoilState(organizationStore.rowDataStore)
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [assignedDeviceRowData, setAssignedDeviceRowData] = useState({})

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
      title: '产品名称',
      dataIndex: 'product',
      key: 'product',
      render: (value) => <span>{value.name}</span>
    },
    {
      title: '报告服务次数',
      dataIndex: 'serviceCount',
      key: 'serviceCount',
      render: (value) => <span>{value}</span>
    },
    {
      title: '是否领取',
      dataIndex: 'equityStatus',
      key: 'equityStatus',
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
          <Permission code="organization.assignedDevice.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="organization.assignedDevice.delete">
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
    if (isVisible && queryParams) {
      getList()
    }
  }, [isVisible, queryParams])

  const getList = useCallback(async () => {
    const { pagination, filters } = queryParams

    console.log('查询条件', {
      ...filters,
      ...pagination,
      organizationId: rowData.id
    })
    const { data } = await organizationService.getBatchAssignedDeviceList({
      ...filters,
      ...pagination,
      organizationId: rowData.id
    })
    console.log('获取已分配的设备列表', data, rowData)
    setTableData(data?.list)
    setTotal(data?.total)
  }, [queryParams, rowData])

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

  const onOk = async () => {
    setIsVisibleDeviceAssignList(true)
    setRowDataStore(rowData)
  }
  const onCancel = () => {
    handleCancel?.()
    onReset()
  }
  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setAssignedDeviceRowData(value)
    setRowDataStore(rowData)
  }

  const onDelete = async (value: any) => {
    const { code, data, msg } = await organizationService.deleteAssignedDevice(
      value.id
    )
    if (code === '200') {
      message.success('已成功删除分配的设备')
      getList()
    } else {
      message.error(msg)
    }
  }

  const rowSelection = {
    // type: 'checkbox' as RowSelectionType,
    // selectedRowKeys,
    // onSelect: onSelectChange as any,
    // onSelectAll: onSelectAll,
    // getCheckboxProps: (record: DataType) => ({
    //   disabled: !!record.operatorId && !ids.includes(record.id)
    // })
  }

  const handleDeviceAssignListOk = () => {
    console.log('操作成功')
    setIsVisibleDeviceAssignList(false)
    setIsVisibleEdit(false)
    // handleOk?.()
    getList()
  }

  return (
    <Drawer
      className={cn(styles.assignedDeviceList)}
      title="设备权益领取记录"
      open={isVisible}
      rootClassName={cn(styles.drawer)}
      width="80%"
      onClose={onCancel}
      destroyOnClose={true}
      footer={
        <div className={cn(['gDrawerFooter'])}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            loading={loading}
            style={{ marginLeft: 16 }}
            className={cn(['gMainButton'])}
            type="primary"
            onClick={onOk}
          >
            去分配
          </Button>
        </div>
      }
    >
      <HeaderWrapper
        isRemoveHeaderTopPadding={true}
        isRemoveHeaderContentTopPadding={true}
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="sn码"
            name="sn"
            rules={[{ required: false, message: '请输入sn码' }]}
          >
            <Input placeholder="请输入sn码" allowClear />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <Table
        rowKey="id"
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        onChange={onChangeTable}
        scroll={{ x: 'max-content' }}
        pagination={{
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `总计${total}条`
        }}
      />

      <DeviceAssignList
        isVisible={isVisibleDeviceAssignList}
        handleOk={handleDeviceAssignListOk}
        handleCancel={() => setIsVisibleDeviceAssignList(false)}
      />

      <DeviceAssignEdit
        isVisible={isVisibleEdit}
        handleOk={handleDeviceAssignListOk}
        handleCancel={() => setIsVisibleEdit(false)}
        rowData={assignedDeviceRowData}
      />
    </Drawer>
  )
})

export default AssignedDeviceList
