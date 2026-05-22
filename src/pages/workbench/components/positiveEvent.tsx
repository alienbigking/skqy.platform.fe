import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './positiveEvent.less'
import DayJS from 'dayjs'
import { cloneDeep } from 'lodash'
import * as echarts from 'echarts'

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
const PositiveEvent: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const divRefs = useRef<HTMLDivElement>(null)
  const [insideBoxSize, setInsideBoxSize] = useState<number[]>([800, 300]) // 内框区域大小 [400, 400]

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let generalWarnData = useRef<any[]>([])

  let eChart: echarts.ECharts
  let minute = 2880
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
          if (index % 120 === 0) {
            return DayJS()
              .startOf('day')
              .add(index * 30, 'second')
              .format('HH')
          }
          return ''
        }
      }
    },
    renderer: 'webgl', // 启用WebGL渲染
    series: [
      {
        type: 'bar',
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

  useEffect(() => {
    if (isVisible) {
      getList()
    }
  }, [isVisible])

  const getList = async () => {}

  const getInitData = (data?: any[]) => {
    generalWarnData.current = []
    generalWarnData.current.push(...(cloneDeep(data) as []))

    eChart = echarts.init(divRefs.current as HTMLDivElement)

    updateChart(generalWarnData.current)
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
    <div className={cn(styles.positiveEvent)}>
      <div className={cn(styles.positiveProportion)}>
        <div className={cn(styles.positiveProportionTitle)}>阳性比例</div>
        <div className={cn(styles.positiveProportionContent)}>
          <div className={cn(styles.man)}>
            <span>男性</span>
            <div className={cn(styles.value)}></div>
          </div>
          <div className={cn(styles.woman)}>
            <span>女性</span>
            <div className={cn(styles.value)}></div>
          </div>
        </div>
      </div>
      <div className={cn(styles.severePositiveProportion)}>
        <div className={cn(styles.positiveProportionTitle)}>重阳比例</div>
        <div className={cn(styles.positiveProportionContent)}>
          <div className={cn(styles.vt)}>
            <div className={styles.vtLeft}>室速</div>
            <div className={cn(styles.value)}></div>
          </div>
          <div className={cn(styles.af)}>
            <div className={cn(styles.afLeft)}>
              <span>房颤</span>
              <span>120bpm</span>
            </div>
            <div className={cn(styles.value)}></div>
          </div>
          <div className={cn(styles.asystole)}>
            <div className={cn(styles.asystoleLeft)}>3s停搏</div>
            <div className={cn(styles.value)}></div>
          </div>
          <div className={cn(styles.tachycardia)}>
            <div className={cn(styles.tachycardiaLeft)}>
              <span>心动过速</span>
              <span>120bpm</span>
            </div>
            <div className={cn(styles.value)}></div>
          </div>

          <div
            className={cn(styles.canvas)}
            ref={divRefs}
            style={{ width: '100%', height: insideBoxSize[1] }}
          />
        </div>
      </div>
    </div>
  )
})

export default PositiveEvent
