import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Table,
  Upload
} from 'antd'
import cn from 'classnames'
import styles from './deviceAssignList.less'
import { filterDeviceType } from '@/utils'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { RowSelectionType } from 'antd/es/table/interface'
import { deviceManagementService } from '@/pages/deviceManagement/services'
import { organizationService } from '../services'
import DeviceAssignConfirm from '@/pages/organization/components/deviceAssignConfirm'
import { HeaderWrapper } from '@/components/headerWrapper'
import { useRecoilValue } from 'recoil'
import { organizationStore } from '@/pages/organization/stores'

const { RangePicker } = DatePicker
const { Dragger } = Upload

const { TextArea } = Input

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  sn?: string
}

interface DataType {
  [key: string]: any
}

interface QueryParams {
  pagination: IPagination
  filters?: Record<string, any>
}

const DeviceAssignList: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<DataType[]>([])
  const rowDataStore = useRecoilValue(organizationStore.rowDataStore)

  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState<QueryParams>({
    pagination: {
      pageNum: 1,
      pageSize: 10
    },
    filters: {}
  })
  const [isVisibleDeviceAssignConfirm, setIsVisibleDeviceAssignConfirm] =
    useState(false)

  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [ids, setIds] = useState<string[]>([])
  const [allSelectedRowData, setAllSelectedRowData] = useState<any[]>([])

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
    }
  ]

  useEffect(() => {
    if (isVisible && queryParams) {
      getList()
    }
  }, [isVisible, queryParams])

  useEffect(() => {
    if (isVisible) {
      getIds()
    }
  }, [isVisible])

  const getList = useCallback(async () => {
    const { pagination, filters } = queryParams

    const { data } = await deviceManagementService.getList({
      ...filters,
      ...pagination
    })
    console.log('获取的设备列表', data)
    setTableData(data?.list)
    setTotal(data?.total)
  }, [queryParams])

  const getIds = async () => {
    const { data } = await organizationService.getBatchAssignedDeviceIds()
    console.log('获取分配的设备ids', data)

    setIds(data)
    // setSelectedRowKeys(data?.list)
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
    console.log('分页', tablePagination, filters, selectedRowKeys)

    setQueryParams((prev) => ({
      ...prev,
      pagination: {
        pageNum: tablePagination.current,
        pageSize: tablePagination.pageSize
      }
    }))
  }

  const onSelectChange = (record: any, selected: any, selectedRows: []) => {
    console.log('当前页面所有选中的', selectedRows)

    let mergedArray: React.Key[]
    let mergedAllSelectedRowData: any[] = []
    const safeSelectedRowKeys = Array.isArray(selectedRowKeys)
      ? selectedRowKeys
      : []
    const safeAllSelectedRowData = Array.isArray(allSelectedRowData)
      ? allSelectedRowData
      : []

    if (selected) {
      const selectedKey = selectedRows
        .filter((item) => !!item)
        .map((item: any) => item.id)
      console.log('参数', record, selected, selectedRows)

      mergedArray = [...new Set([...safeSelectedRowKeys, ...selectedKey])]
      mergedAllSelectedRowData = mergeRowDataById(
        safeAllSelectedRowData,
        selectedRows
      )
    } else {
      mergedArray = safeSelectedRowKeys.filter((value) => value !== record.id)
      mergedAllSelectedRowData = safeAllSelectedRowData.filter(
        (item) => item.id !== record.id
      )
    }

    console.log('合并后的数组key', mergedArray)
    console.log('合并的后的行数据', mergedAllSelectedRowData)
    setSelectedRowKeys(mergedArray)
    setAllSelectedRowData(mergedAllSelectedRowData)
  }

  const onSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    console.log('当前页全选', selected, selectedRows, changeRows)

    let mergedArray: React.Key[]
    let mergedAllSelectedRowData: any[] = []

    const safeSelectedRowKeys = Array.isArray(selectedRowKeys)
      ? selectedRowKeys
      : []
    const safeAllSelectedRowData = Array.isArray(allSelectedRowData)
      ? allSelectedRowData
      : []

    if (selected) {
      const selectedKey = selectedRows
        .filter((item: any) => !!item)
        .map((item: any) => item.id)

      mergedArray = [...new Set([...safeSelectedRowKeys, ...selectedKey])]
      mergedAllSelectedRowData = mergeRowDataById(
        safeAllSelectedRowData,
        selectedRows
      )
      console.log('点击全选', selectedKey)
    } else {
      const selectedKey = changeRows
        .filter((item: any) => !!item)
        .map((item: any) => item.id)
      console.log('取消全选', selectedKey)
      let set = new Set(selectedKey)

      let result = safeSelectedRowKeys.filter((item) => !set.has(item))

      mergedArray = [...new Set([...result])]

      mergedAllSelectedRowData = safeAllSelectedRowData.filter(
        (item) => !changeRows.some((row: any) => row?.id === item?.id)
      )
      console.log(
        '取消全选数据集',
        safeAllSelectedRowData,
        mergedAllSelectedRowData
      )
    }

    console.log('全选数据集合', mergedAllSelectedRowData)
    setSelectedRowKeys(mergedArray)
    setAllSelectedRowData(mergedAllSelectedRowData)
  }

  const mergeRowDataById = (prev: any[], next: any[]) => {
    const map = new Map<string, any>()

    prev.forEach((item) => {
      if (item?.id) map.set(item.id, item)
    })

    next.forEach((item) => {
      if (item?.id) map.set(item.id, item)
    })

    return Array.from(map.values())
  }

  const onOk = async () => {
    console.log('点击保存')
    setIsVisibleDeviceAssignConfirm(true)
  }
  const onCancel = () => {
    handleCancel?.()
    onReset()
    setSelectedRowKeys([])
  }

  const handleDeviceAssignConfirmOk = () => {
    setIsVisibleDeviceAssignConfirm(false)
    setSelectedRowKeys([])
    setAllSelectedRowData([])
    handleOk?.()
  }

  const rowSelection = {
    type: 'checkbox' as RowSelectionType,
    selectedRowKeys,
    onSelect: onSelectChange as any,
    onSelectAll: onSelectAll,
    getCheckboxProps: (record: DataType) => ({
      disabled:
        ids.includes(record.id) && record.organization?.id !== rowDataStore.id
    })
  }

  return (
    <Drawer
      className={cn(styles.deviceAssignList)}
      title="设备权益配置列表"
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
            选中
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
        rowSelection={rowSelection}
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
      <DeviceAssignConfirm
        isVisible={isVisibleDeviceAssignConfirm}
        selectedRowKeys={selectedRowKeys}
        handleOk={handleDeviceAssignConfirmOk}
        handleCancel={() => setIsVisibleDeviceAssignConfirm(false)}
      />
    </Drawer>
  )
})

export default DeviceAssignList
