import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Spin,
  Table,
  Upload,
  UploadFile
} from 'antd'
import cn from 'classnames'
import styles from './historicalConclusion.less'
import {
  filterInspectionResult,
  filterPositiveLevelResult,
  isNullObject
} from '@/utils'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { reportAnalysisService } from '@/pages/reportAnalysis/services'
import ReportAnalysisDetail from '@/pages/reportAnalysis/components/reportAnalysisDetail'
import { commonService } from '@/pages/common/services'

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

const HistoricalConclusion: React.FC<Props> = memo((props) => {
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
  let ecgDataOssIdRef = useRef({
    id: ''
  })

  const columns: ColumnsType<DataType> = [
    {
      title: '检查结果',
      dataIndex: 'positive',
      key: 'positive',
      render: (value) => <span>{filterInspectionResult(value)}</span>
    },
    {
      title: '阳性等级',
      dataIndex: 'positiveLevel',
      key: 'positiveLevel',
      render: (value) => <span>{filterPositiveLevelResult(value)}</span>
    },
    {
      title: '检查结论',
      dataIndex: 'conclusion',
      key: 'conclusion',
      render: (value) => <span>{value}</span>
    },
    {
      title: '文件名',
      dataIndex: 'originalName',
      key: 'originalName',
      render: (value, record, index) => (
        <div className={cn(styles.download)}>
          <Spin tip="下载中" spinning={record.spinning}>
            <Button onClick={() => onDownload(record, index)} type="link">
              {value}
            </Button>
          </Spin>
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
    }
    // {
    //   title: '操作',
    //   key: 'action',
    //   width: 250,
    //   fixed: 'right',
    //   render: (value) => (
    //     <div className={cn(styles.tableActions)}>
    //       <Button
    //         type="text"
    //         className={cn(['gGeneralTextButton'])}
    //         onClick={() => onView(value)}
    //       >
    //         查看
    //       </Button>
    //
    //       {/*<Popconfirm*/}
    //       {/*  title="是否确认删除？"*/}
    //       {/*  description="此操作会将当前的数据删除，您确定要删除吗？"*/}
    //       {/*  onConfirm={() => onDelete(value)}*/}
    //       {/*  okText="确定"*/}
    //       {/*  cancelText="取消"*/}
    //       {/*>*/}
    //       {/*  <Button type="text" className={cn(['gDeleteTextButton'])}>*/}
    //       {/*    删除*/}
    //       {/*  </Button>*/}
    //       {/*</Popconfirm>*/}
    //     </div>
    //   )
    // }
  ]

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getList()
    }
  }, [rowData, isVisible])

  const getList = async () => {
    const { data } = await reportAnalysisService.getHistoricalConclusion({
      id: rowData.id
      // ...pagination
    })
    console.log('获取的历史结论列表', data)
    setTableData(
      data.list?.map((item: any) => {
        item.spinning = false
        return item
      })
    )
    setTotal(data.total)
  }

  const onDownload = async (value: any, index: number) => {
    console.log('当前行记录', value)
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.spinning) {
          item.spinning = true
        }
        return item
      })
    )
    const { code, data } = await commonService.getDownloadUrl(value.ossId)
    if (code === '200') {
      console.log('文件下载链接', data)
      try {
        const response = await commonService.download(data.url)
        console.log('返回的文件response', response)

        const link = document.createElement('a')
        link.href = URL.createObjectURL(response)
        link.download = value.originalName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (e) {
        console.log('下载异常', e)
        message.warning(`第${index + 1}条数据文件下载异常，请重试`)
      } finally {
        console.log('触发了最后')
        setTableData(
          tableData.map((item) => {
            if (item.id === value.id && item.spinning) {
              item.spinning = false
            }
            return item
          })
        )
      }
    }
  }

  const onView = (value: any) => {
    setCurrentRowData(value)
    setIsVisibleDetail(true)
  }

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters)
    setPagination({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleDetail(false)
  }
  const onOk = async () => {
    console.log('点击保存')
    form.resetFields()
    handleOk?.()
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Drawer
      className={cn(styles.historicalConclusion)}
      title="历史结论"
      open={isVisible}
      rootClassName={cn(styles.drawer)}
      width="80%"
      onClose={onCancel}
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
        columns={columns}
        dataSource={tableData}
        onChange={onChangeTable}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
      <ReportAnalysisDetail
        rowData={currentRowData}
        isVisible={isVisibleDetail}
        handleOk={handleNewOk}
        handleCancel={() => setIsVisibleDetail(false)}
      />
    </Drawer>
  )
})

export default HistoricalConclusion
