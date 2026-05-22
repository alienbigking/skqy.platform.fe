import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './generalWarn.less'
import { cloneDeep } from 'lodash'
import * as echarts from 'echarts'
import { workbenchService } from '@/pages/workbench/services'
import DayJS from 'dayjs'

interface Props {
  isVisible?: boolean
  dataSource?: any[]
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}
const GeneralWarn: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const divRefs = useRef<HTMLDivElement>(null)
  const [insideBoxSize, setInsideBoxSize] = useState<number[]>([800, 220]) // 内框区域大小 [400, 400]

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let eChart: echarts.ECharts
  let minute = 2880
  let heartRate = 220

  let generalWarnData = useRef<any[]>([])

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
    // title: {
    //   text: '24小时心率趋势图'
    // },
    legend: {
      selectedMode: false
    },
    grid: {
      show: true,
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '10%'
      // borderWidth: 0
    },
    tooltip: {
      show: false,
      transitionDuration: 0
    },
    yAxis: {
      type: 'value'
      // data: yArr,
      // show: true,
      // max: 100,
      // min: 0,
      // axisLabel: {},
      // splitLine: {}
    },
    xAxis: {
      type: 'category',
      data: [],
      // show: true,
      splitLine: {},
      boundaryGap: true // 设置为 false 以确保数据点直接对应到类别上
      // axisLabel: {
      //   interval: 0, // 设置为 0 以确保每个类别都显示标签
      //   formatter: function (value: any, index: number) {
      //     // console.log('值', value, index)
      //     // 每小时显示一个标签
      //     if (index % 120 === 0) {
      //       return DayJS()
      //         .startOf('day')
      //         .add(index * 30, 'second')
      //         .format('HH')
      //     }
      //     return ''
      //   }
      // }
    },
    renderer: 'webgl', // 启用WebGL渲染
    series: [
      {
        name: '',
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        // label: {
        //   show: true
        // },
        data: []
      }
    ],
    color: ['#74c99a', '#e6f4ee', '#c7f1d7', '#c6e1fb', '#d3d5d4', '#fae4d2']
  })

  useEffect(() => {
    getList()
    handleDate()

    return () => {
      eChart?.dispose()
    }
  }, [])

  const getList = async () => {
    const { data } = await workbenchService.getImmediatePositiveWarnList()
    console.log('近期阳性预警', data)
    // 30 31 2 20 28 29
    // const result = Object.values(data).map((array: any) =>
    //   array.map((item: { count: number }) => item.count)
    // )
    // 定义type的排序顺序
    const typeOrder = ['30', '31', '2', '20', '28', '29']

    // 对每个日期的数组根据type进行排序
    const sortedData = Object.values(data).map((dateArray: any) =>
      dateArray.sort(compareType)
    )
    // 比较函数根据typeOrder排序
    const compareType = (a: { type: string }, b: { type: string }) => {
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    }
    // 提取count值形成二维数组
    const result = sortedData.map((dateArray) =>
      dateArray.map((item: { count: any }) => item.count)
    )

    const transformedArray = result[0].map(
      (_: any, colIndex: string | number) => result.map((row) => row[colIndex])
    )

    console.log('结构化后的数据', transformedArray)
    getInitData(transformedArray)
  }
  const getInitData = (data?: any[]) => {
    generalWarnData.current = []
    generalWarnData.current.push(...(cloneDeep(data) as []))

    if (divRefs.current) {
      // 如果已经有旧实例，先销毁
      const exist = echarts.getInstanceByDom(divRefs.current)
      if (exist) {
        exist.dispose()
      }

      eChart = echarts.init(divRefs.current)
      updateChart(generalWarnData.current)
    } else {
      console.warn('ECharts 初始化失败：divRefs.current 为空')
    }

    // eChart = echarts.init(divRefs.current as HTMLDivElement)
    // updateChart(generalWarnData.current)
  }

  const updateChart = (data: number[][]) => {
    // let totalData: any[] = []
    // for (let i = 0; i < data[0]?.length; ++i) {
    //   let sum = 0
    //   for (let j = 0; j < data.length; ++j) {
    //     sum += data[j][i]
    //   }
    //   totalData.push(sum)
    // }

    const series = [
      '室性早搏',
      '室上性早搏',
      '房颤',
      '室速',
      '心动过速',
      '心动过缓'
    ].map((name, index) => {
      return {
        name,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        label: {
          show: true,
          formatter: (params: { value: number }) => {
            // console.log('参数值', params)
            return params.value > 0 ? params.value : ''
          }
        },
        data: data[index]
        // data: data[sid].map((d, did) =>
        //   totalData[did] <= 0 ? 0 : d / totalData[did]
        // )
      }
    })

    console.log('series', series)
    const xAxis = {
      ...options.xAxis,
      data: handleDate()
    }

    eChart.setOption(
      {
        animation: false,
        animationDelay: 0,
        animationDurationUpdate: 0,
        ...options,
        xAxis: xAxis,
        series: series
      },
      true
    )
  }

  const handleDate = () => {
    // 获取今天的日期
    const today = DayJS()
    const formattedToday = '今日'

    // 获取昨日的日期
    const yesterday = today.subtract(1, 'day')
    const formattedYesterday = '昨日'

    // 动态获取其他指定日期
    const date1 = today.subtract(4, 'day').format('MM/DD')
    const date2 = today.subtract(3, 'day').format('MM/DD')
    const date3 = today.subtract(2, 'day').format('MM/DD')
    console.log(date1, date2, date3, formattedYesterday, formattedToday)

    return [date1, date2, date3, formattedYesterday, formattedToday]
  }

  const onOpen = (value: any) => {
    handleOk?.(value)
    // setRowData({
    //   id: value.content.id
    // })
  }

  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleHistory(false)
    getList()
  }

  return (
    <div className={cn(styles.generalWarn)}>
      <div className={cn(styles.header)}>近期总预警分类</div>
      <div className={cn(styles.content)}>
        <div
          className={cn(styles.canvas)}
          ref={divRefs}
          style={{ width: '100%', height: insideBoxSize[1] }}
        />
      </div>
    </div>
  )
})

export default GeneralWarn
