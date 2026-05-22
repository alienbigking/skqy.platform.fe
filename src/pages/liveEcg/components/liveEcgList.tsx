import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Table,
  Tag,
  Upload,
  UploadFile
} from 'antd'
import cn from 'classnames'
import styles from './liveEcgList.less'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { liveEcgService } from '../services'
import {
  base64ToBinary,
  filterEventsType,
  gender,
  symptomLabelOptions
} from '@/utils'
import LiveEcgDetail from '@/pages/liveEcg/components/liveEcgDetail'

const { RangePicker } = DatePicker
const { Dragger } = Upload

const { TextArea } = Input

interface Props {
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

const LiveEcgList: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [isVisibleDetail, setIsVisibleDetail] = useState(false)

  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [selectedTags, setSelectedTags] = React.useState<number[]>([])

  const [rowData, setRowData] = useState<any>({})

  const [form] = Form.useForm()
  let ecgDataOssIdRef = useRef({
    id: ''
  })

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
      title: '电话',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '平均心率',
      dataIndex: 'avgHr',
      key: 'avgHr',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '事件',
      dataIndex: 'eventStr',
      key: 'eventStr',
      render: (value, record) =>
        value && (
          <div className={cn(styles.eventStr)}>
            <span> {value}</span>
          </div>
        )
    },
    {
      title: '病史',
      dataIndex: 'symptomStr',
      key: 'symptomStr',
      width: 300,
      fixed: 'right',
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
          {/*<Permission code="liveEcg.list.detail">*/}
          <Button
            type="text"
            className={cn(['gGeneralTextButton'])}
            onClick={() => onDetail(value)}
          >
            详情
          </Button>
          {/*</Permission>*/}
        </div>
      )
    }
  ]

  useEffect(() => {
    if (isVisible && pagination) {
      getList()
    }
  }, [pagination, isVisible])

  const getList = useCallback(async () => {
    let conditions = selectedTags.map((value) => {
      return {
        type: String(value)
      }
    })
    const { data } = await liveEcgService.getList({
      ...pagination,
      conditions: JSON.stringify(conditions)
    })
    console.log('获取所有实时在线用户列表', data)

    setTableData(
      data?.list.map((item: any) => {
        // let str = ''
        // item?.summary?.forEach((value: any) => {
        //   str += value.detail + value.short + '\n'
        // })
        // item.conclusion = str

        let str = ''
        item?.events?.forEach((event: any, index: number) => {
          str +=
            filterEventsType(Number(event.type)) +
            (index < item.events.length - 1 ? '、' : '')
        })

        item.eventStr = str || ''

        let symptomStr = ''
        item?.labels?.forEach((value: any, index: number) => {
          symptomStr +=
            value.name + (index < item.labels.length - 1 ? '、' : '')
        })
        item.symptomStr = symptomStr || ''
        return item
      })
    )

    setTotal(data?.total)
  }, [pagination])

  const onDetail = async (value: any) => {
    console.log('获取的行数据', value)

    const { data } = await liveEcgService.getDetail(value.id)
    console.log('获取的详情数据', data)

    setRowData({
      content: {
        username: value.username,
        age: value.age,
        mobile: value.mobile,
        labels: value.labels,
        metrics: {
          ...data
        },
        summary: data.summary
      },
      createAt: value.createAt,
      ecgData: base64ToBinary(data?.original)
    })

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
  const onTagChange = (value: number, checked: boolean) => {
    console.log('tag', value, checked)

    const allSelectedTags = checked
      ? [...selectedTags, value]
      : selectedTags.filter((tag) => tag !== value)

    setSelectedTags(allSelectedTags)
    setPagination({
      pageNum: 1,
      pageSize: pagination.pageSize
    })
    console.log('选择的标签', allSelectedTags)
  }
  return (
    <Drawer
      title="实时在线消息列表"
      open={isVisible}
      rootClassName={cn(styles.liveEcgList)}
      width="100%"
      onClose={onCancel}
      destroyOnClose={true}
      footer={
        <div className={cn(['gDrawerFooter'])}>
          <Button onClick={onCancel}>关闭</Button>
          {/*<Button*/}
          {/*  loading={loading}*/}
          {/*  style={{ marginLeft: 16 }}*/}
          {/*  className={cn(['gMainButton'])}*/}
          {/*  type="primary"*/}
          {/*  onClick={onOk}*/}
          {/*>*/}
          {/*  确认*/}
          {/*</Button>*/}
        </div>
      }
    >
      <div className={cn(styles.tableMain)}>
        <div className={cn(styles.actions)}>
          {symptomLabelOptions.map<React.ReactNode>((tag, index) => (
            <Tag.CheckableTag
              key={index}
              checked={selectedTags.includes(tag.value)}
              onChange={(checked) => onTagChange(tag.value, checked)}
              style={{ marginRight: 20 }}
            >
              {tag.label}
            </Tag.CheckableTag>
          ))}
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          onChange={onChangeTable}
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

      <LiveEcgDetail
        rowData={rowData}
        isVisible={isVisibleDetail}
        handleOk={handleNewOk}
        handleCancel={() => setIsVisibleDetail(false)}
      />
    </Drawer>
  )
})

export default LiveEcgList
