import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Table,
  Upload,
  UploadFile
} from 'antd'
import cn from 'classnames'
import styles from './pdfNumberRecordList.less'
import { filterPdfNumberType } from '@/utils'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { organizationService } from '../services'

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

const PdfNumberRecordList: React.FC<Props> = memo((props) => {
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
      title: '类型',
      dataIndex: 'changeType',
      key: 'changeType',
      render: (value) => <span>{filterPdfNumberType(value)}</span>
    },
    {
      title: '数量',
      dataIndex: 'delta',
      key: 'delta',
      render: (value) => <span>{value}</span>
    },
    {
      title: '变动前数量',
      dataIndex: 'quotaBefore',
      key: 'quotaBefore',
      render: (value) => <span>{value}</span>
    },
    {
      title: '变动后数量',
      dataIndex: 'quotaAfter',
      key: 'quotaAfter',
      render: (value) => <span>{value}</span>
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
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
    if (isVisible && pagination) {
      getList()
    }
  }, [isVisible, rowData, pagination])

  const getList = useCallback(async () => {
    console.log('列表rowData', rowData.id)

    const { data } = await organizationService.getPdfNumberList({
      id: rowData.id,
      ...pagination
    })
    console.log('获取的设备列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [rowData, pagination])

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters, selectedRowKeys)

    setPagination({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
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

  return (
    <Drawer
      className={cn(styles.pdfNumberRecordList)}
      title="PDF报告数量记录列表"
      open={isVisible}
      rootClassName={cn(styles.drawer)}
      width="80%"
      onClose={onCancel}
      destroyOnClose={true}
      footer={
        <div className={cn(['gDrawerFooter'])}>
          <Button onClick={onCancel}>取消</Button>
        </div>
      }
    >
      <Table
        rowKey="id"
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
    </Drawer>
  )
})

export default PdfNumberRecordList
