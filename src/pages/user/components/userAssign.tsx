import React, { memo, useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Table,
  Upload,
  UploadFile
} from 'antd'
import cn from 'classnames'
import styles from './userAssign.less'
import { calculateAge, gender } from '@/utils'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { miniProgramUserService } from '@/pages/miniProgramUser/services'
import { RowSelectionType } from 'antd/es/table/interface'
import { userService } from '@/pages/user/services'

const { RangePicker } = DatePicker
const { Dragger } = Upload

const { TextArea } = Input

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

interface DataType {
  [key: string]: any
}

type FieldType = {
  name?: string
  gender?: string
  age?: string
  mobile?: string
  times?: string[]
  wearStartTime?: string
  wearEndTime?: string
  files?: string
  sn?: string
  organizationId?: string
  outerBusinessId?: string
  medicalHistory?: string
  symptoms?: string
  conclusion?: string
  remark?: string
}

const UserAssign: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [isVisibleDetail, setIsVisibleDetail] = useState(false)

  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [currentRowData, setCurrentRowData] = useState<any>({})

  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [ids, setIds] = useState<string[]>([])

  const columns: ColumnsType<DataType> = [
    {
      title: '时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
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
      dataIndex: 'age',
      key: 'age',
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
      title: '家庭地址',
      dataIndex: 'address',
      key: 'address',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '紧急联系人',
      dataIndex: 'emergencyContact',
      key: 'emergencyContact',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '联系人手机',
      dataIndex: 'emergencyContactMobile',
      key: 'emergencyContactMobile',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (isVisible && pagination) {
      getList()
    }
  }, [isVisible, pagination])

  useEffect(() => {
    if (isVisible) {
      getIds()
    }
  }, [isVisible])

  const getList = async () => {
    const values = form.getFieldsValue()

    const { data } = await miniProgramUserService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的小程序用户列表', data)

    setTableData(data.list)
    setTotal(data.total)
  }

  const getIds = async () => {
    const { data } = await userService.getAssignedIds({
      id: rowData.id
    })

    setIds(data)
    setSelectedRowKeys(data)
    console.log('已分配的用户ID', data)
  }

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters, selectedRowKeys)

    setPagination({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onSelectChange = (record: any, selected: any, selectedRows: []) => {
    console.log('当前页面所有选中的', selectedRows)

    let mergedArray: React.Key[]

    if (selected) {
      const selectedKey = selectedRows
        .filter((item) => !!item)
        .map((item: any) => item.id)
      console.log('参数', record, selected, selectedKey)
      const safeSelectedRowKeys = Array.isArray(selectedRowKeys)
        ? selectedRowKeys
        : []
      mergedArray = [...new Set([...safeSelectedRowKeys, ...selectedKey])]
      console.log('合并后的数组', mergedArray)
    } else {
      mergedArray = selectedRowKeys.filter((value) => value !== record.id)
    }

    setSelectedRowKeys(mergedArray)
  }

  const onSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    console.log('当前页全选', selected, selectedRows, changeRows)
    let mergedArray: React.Key[]

    if (selected) {
      const selectedKey = selectedRows
        .filter((item: any) => !!item)
        .map((item: any) => item.id)

      mergedArray = [...new Set([...selectedRowKeys, ...selectedKey])]
    } else {
      const selectedKey = changeRows
        .filter((item: any) => !!item)
        .map((item: any) => item.id)

      let set = new Set(selectedKey)

      let result = selectedRowKeys.filter((item) => !set.has(item))

      mergedArray = [...new Set([...result])]
    }

    setSelectedRowKeys(mergedArray)
  }

  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleDetail(false)
  }
  const onOk = async () => {
    console.log('点击保存')
    const { code, data } = await userService.assign({
      id: rowData.id,
      assignIds: selectedRowKeys as string[]
    })
    console.log('分配成功', data)
    if (code === '200') {
      message.success('分配成功')
      handleOk?.()
      setSelectedRowKeys([])

      reset()
    } else {
      message.error('分配失败')
    }
  }
  const onCancel = () => {
    handleCancel?.()
    reset()
  }

  // 重置
  const reset = () => {
    setPagination({
      pageNum: 1,
      pageSize: 10
    })
  }

  const rowSelection = {
    type: 'checkbox' as RowSelectionType,
    selectedRowKeys,
    onSelect: onSelectChange as any,
    onSelectAll: onSelectAll,
    getCheckboxProps: (record: DataType) => ({
      disabled: !!record.operatorId && !ids.includes(record.id)
    })
  }

  return (
    <Drawer
      className={cn(styles.DeviceAssign)}
      title="分配小程序用户列表"
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
            确认
          </Button>
        </div>
      }
    >
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
      {/*<ReportAnalysisDetail*/}
      {/*  rowData={currentRowData}*/}
      {/*  isVisible={isVisibleDetail}*/}
      {/*  handleOk={handleNewOk}*/}
      {/*  handleCancel={() => setIsVisibleDetail(false)}*/}
      {/*/>*/}
    </Drawer>
  )
})

export default UserAssign
