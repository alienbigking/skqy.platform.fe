import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Tag,
  Upload,
  UploadFile
} from 'antd'
import cn from 'classnames'
import styles from './miniProgramUserHistory.less'
import {
  base64ToBinary,
  filterEventsType,
  gender,
  isNullObject,
  symptomLabelOptions
} from '@/utils'
import DayJS from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { miniProgramUserService } from '@/pages/miniProgramUser/services'
import { HeartRate } from '@/components/heartRate'
import {
  EHeartRateMode,
  EHeartRateType
} from '@/components/heartRate/types/heartRate'
import * as echarts from 'echarts'
import { HeaderWrapper } from '@/components/headerWrapper'
import { cloneDeep } from 'lodash'
import { Permission } from '@/components/permission'

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

type FormFieldType = {
  date: any
}

const MiniProgramUserHistory: React.FC<Props> = memo((props) => {
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
  const [insideBoxSize, setInsideBoxSize] = useState<number[]>([800, 300]) // 内框区域大小 [400, 400]
  const [heartRateData, setHeartRateData] = useState([])
  const [defaultExpandAllRows, setDefaultExpandAllRows] = useState(false)
  const [selectedTags, setSelectedTags] = React.useState<number[]>([])

  const [form] = Form.useForm()

  const divRefs = useRef<HTMLDivElement>(null)
  let ecgData = useRef<any[]>([])
  const avgHeartRateWorkerRef = useRef<any>()

  let eChart: echarts.ECharts
  let minute = 1440
  let second = 86400
  let heartRate = 220

  // 矩阵绘制的点的数量
  const xArr = Array.from(
    // 这里的数值表示绘制的区域大小width,表示在这么宽的区域能绘制多少数据点
    Array(minute + 1).keys(),
    (n) => n
  )

  const yArr = Array.from(
    // 这里的数值表示绘制的区域大小width,表示在这么宽的区域能绘制多少数据点
    Array(heartRate + 1).keys(),
    (n) => n
  )

  const [options] = useState<any>({
    title: {
      text: '24小时心率趋势图'
    },
    grid: {
      show: true,
      // left: '0px',
      // top: '0px',
      // right: '0px',
      // bottom: '0px',
      borderWidth: 0
    },
    tooltip: {
      show: false,
      transitionDuration: 0
    },
    yAxis: {
      type: 'value',
      data: yArr,
      show: true,
      max: 180,
      min: 0,
      axisLabel: {},
      splitLine: {}
    },
    xAxis: {
      type: 'category',
      data: xArr,
      show: true,
      splitLine: {},
      boundaryGap: false, // 设置为 false 以确保数据点直接对应到类别上
      axisLabel: {
        interval: 0, // 设置为 0 以确保每个类别都显示标签
        formatter: function (value: any, index: number) {
          // console.log('值', value, index)

          // 每小时显示一个标签
          if (index % 60 === 0) {
            return DayJS()
              .startOf('day')
              .add(index * 60, 'second')
              .format('HH')
          }
          return ''
        }
      }
    },
    renderer: 'webgl', // 启用WebGL渲染
    series: [
      {
        type: 'line',
        // smooth: true,
        // sampling: 'lttb',
        // symbolSize: 1,
        // progressive: 400,
        // progressiveThreshold: 5000,
        // emphasis: {
        //   focus: 'series'
        // },
        showSymbol: false,
        hoverAnimation: false, // 禁用 hover 时的动画效果，以提高性能
        data: [],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#00EBC7', // 设置线条颜色为 #00FF00
          width: 2, // 根据需要调整线的宽度
          curveness: 0.2 // 调整曲线的曲率，使其看起来更平滑
        }
      }
    ]
  })

  const columns: ColumnsType<DataType> = [
    {
      title: '数据上传时间',
      dataIndex: 'startTime',
      key: 'startTime',
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
          <Permission code="miniProgramUser.list.apply">
            <Popconfirm
              title="提交此刻分析？"
              open={value.isOpen}
              description={() => (
                <div>
                  出具报告是从当前此刻起向前回溯一段连续佩戴周期的心电波形交由医生进行分析。
                  <br />
                  <br />
                  提交后，可在报告与分析界面查看数据进度，数据准备完成可进行报告分析。
                </div>
              )}
              onConfirm={() => onConfirm(value)}
              onCancel={() => onCancelConfirm(value)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                className={cn(['gGeneralTextButton'])}
                onClick={() => onAnalysis(value)}
              >
                分析此刻
              </Button>
            </Popconfirm>
          </Permission>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (isVisible) {
      initForm()
      avgHeartRateWorkerRef.current = new Worker(
        new URL('@/workers/avgHeartRate.ts', import.meta.url)
      )
      console.log('历史心电记录worker实例', avgHeartRateWorkerRef.current)
    }
    return () => {
      avgHeartRateWorkerRef.current?.terminate()
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible && !isNullObject(rowData) && pagination) {
      getList()
    }
  }, [rowData, isVisible, pagination])

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getHeartRateData()
    }
  }, [isVisible, rowData])

  const initForm = () => {
    form.setFieldsValue({
      date: DayJS()
    })
  }

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    console.log('当前查询条件', values)
    const date = values.date ? DayJS(values.date) : DayJS()

    const startOfDay = date.startOf('day')
    const endOfDay = date.endOf('day')

    let conditions = selectedTags.map((value) => {
      return {
        type: String(value)
      }
    })

    console.log('查询条件', conditions)

    const { data } = await miniProgramUserService.getHistory({
      id: rowData.id,
      startTime: startOfDay.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endOfDay.format('YYYY-MM-DD HH:mm:ss'),
      ...pagination,
      conditions: JSON.stringify(conditions)
    })

    setDefaultExpandAllRows(true)

    setTableData(
      data?.list?.map((item: any) => {
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

        item.isOpen = false

        return item
      })
    )

    setTotal(data?.total)
  }, [rowData, pagination])

  const getHeartRateData = async () => {
    const values = form.getFieldsValue()
    const date = values.date ? DayJS(values.date) : DayJS()

    const startOfDay = date.startOf('day')
    const endOfDay = date.endOf('day')

    const { data } = await miniProgramUserService.getHeartRateList({
      id: rowData.id,
      startTime: startOfDay.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endOfDay.format('YYYY-MM-DD HH:mm:ss')
    })

    // setHeartRateData(data)
    formatHeartRateData(data)

    // const formattedData = formatHeartRateData(data)
    // console.log('格式化后的数据', formattedData)
    // getInitData(formattedData)
  }

  const formatHeartRateData = (data: any[]) => {
    // 按 startTime 排序
    data.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )

    // 获取最小时间和最大时间
    const minTime = DayJS(data[0]?.startTime).startOf('day')
    const maxTime = DayJS(data[0]?.startTime).endOf('day')

    // 填充从 00:00 到开始时间的间隔，每隔 30 秒填充一个 '-'
    let xData: any[] = []

    for (
      let time = DayJS(minTime).startOf('day');
      time.isBefore(maxTime);
      time = time.add(60, 'second')
    ) {
      xData.push({
        time: time.format('YYYY-MM-DD HH:mm:ss'),
        value: '-'
      })
    }
    // console.log('x轴坐标轴', xData)
    const result = filterLastRecordPerMinute(data)
    console.log('过滤后的结果', result)

    calculateHeartRate(result, xData)
  }
  const filterLastRecordPerMinute = (data: any[]) => {
    const map = new Map()

    data.forEach((record, index) => {
      const minute = record.startTime.slice(0, 16) // YYYY-MM-DD HH:MM
      if (!map.has(minute) || map.get(minute).startTime < record.startTime) {
        const newRecord = {
          ...record,
          startTime: `${record.startTime.slice(0, 17)}00`
        }
        map.set(minute, newRecord)
      }
    })
    // console.log('map结构', map.values())

    return Array.from(map.values())
  }

  const calculateHeartRate = (data: any[], xData: any[]) => {
    // 向 Worker 发送消息
    avgHeartRateWorkerRef.current.postMessage({
      data: data,
      xData: xData
    })

    // 监听来自 Worker 的消息
    avgHeartRateWorkerRef.current.onmessage = (event: any) => {
      console.log('返回的数据', event)
      getInitData(event.data.avgHeartRateData)
    }
  }

  const getInitData = (data?: any[]) => {
    ecgData.current = []
    ecgData.current.push(...(cloneDeep(data) as []))

    eChart = echarts.init(divRefs.current as HTMLDivElement)

    updateChart(ecgData.current)
  }

  const updateChart = (data: number[]) => {
    const result = {
      ...options.series[0],
      data: data
    }

    eChart.setOption(
      {
        animation: false,
        animationDelay: 0,
        animationDurationUpdate: 0,
        ...options,
        series: [result]
      },
      true
    )
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

  const onConfirm = async (value: any) => {
    console.log('当前行记录', value)
    const { code, data, msg } = await miniProgramUserService.setTime({
      id: rowData.id,
      recordId: value.id
    })

    if (code === '200') {
      message.success('申请出具报告成功,稍后可在”报告分析“页面查看报告情况。')
      getList()
    } else {
      message.error(msg)
    }

    setTableData(
      tableData.map((item: any) => {
        if (item.id === value.id) {
          item.isOpen = false
        }
        return item
      })
    )
  }

  const onCancelConfirm = (value: any) => {
    setTableData(
      tableData.map((item: any) => {
        if (item.id === value.id) {
          item.isOpen = false
        }
        return item
      })
    )
  }

  const onAnalysis = (value: any) => {
    setTableData(
      tableData.map((item: any) => {
        item.isOpen = item.id === value.id
        return item
      })
    )
  }
  const onOk = async () => {
    console.log('点击保存')
    form.resetFields()
    handleOk?.()
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
    console.log('关闭了')
    onReset()
  }

  const onSearch = () => {
    getHeartRateData()
    setPagination({
      pageNum: 1,
      pageSize: pagination.pageSize
    })
  }
  const onReset = () => {
    form.resetFields()

    getHeartRateData()

    setSelectedTags([])
    setPagination({
      pageNum: 1,
      pageSize: 10
    })
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
      title="历史检测记录"
      open={isVisible}
      rootClassName={cn(styles.miniProgramUserHistory)}
      width="100%"
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
      <div className={cn(styles.header)}>
        <HeaderWrapper
          // title="心率趋势"
          form={form}
          onSearchCallback={onSearch}
          onResetCallback={onReset}
        >
          <Col span={6}>
            <Form.Item<FormFieldType>
              label="日期"
              name="date"
              rules={[{ required: false, message: '请输入日期' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
            </Form.Item>
          </Col>
        </HeaderWrapper>
      </div>

      <div className={cn(styles.content)}>
        <div
          className={cn(styles.canvas)}
          ref={divRefs}
          style={{ width: '100%', height: insideBoxSize[1] }}
        />

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
          {!!tableData?.length && (
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
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showTotal: (total) => `总计${total}条`
              }}
              expandable={{
                defaultExpandAllRows: true,
                expandedRowRender: (record) => (
                  <div className={cn(styles.ecg)}>
                    <HeartRate
                      mode={EHeartRateMode.previewMode}
                      type={EHeartRateType.thirtySecHeartRate}
                      isShowUserInfo={false}
                      dataSource={{
                        // createAt: DayJS(rowData.createAt).unix(),
                        // content: {
                        //   ...rowData,
                        //   summary: record.summary,
                        //   original: record?.original,
                        //   metrics: {
                        //     afLoad: record.afLoad,
                        //     avgHr: record.avgHr,
                        //     dc: record.dc,
                        //     rmssd: record.rmssd,
                        //     sdnn24: record.sdnn24,
                        //     sveb1: record.sveb1,
                        //     totalBeats: record.totalBeats,
                        //     veb: record.veb
                        //   }
                        // },
                        timestamp: DayJS(record.createAt).unix(),
                        ecgData: base64ToBinary(record?.original)
                      }}
                    />
                  </div>
                ),
                rowExpandable: (record) => true
              }}
            />
          )}
        </div>
      </div>
    </Drawer>
  )
})

export default MiniProgramUserHistory
