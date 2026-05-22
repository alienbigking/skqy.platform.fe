import React, { memo, useEffect, useRef, useState } from 'react'
import { Badge, Form } from 'antd'
import cn from 'classnames'
import styles from './severePositive.less'
import { cloneDeep } from 'lodash'
import * as echarts from 'echarts'
import { ArrowUpOutlined } from '@ant-design/icons'
import { workbenchService } from '@/pages/workbench/services'

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
const SeverePositive: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const divRefs = useRef<HTMLDivElement>(null)
  const [insideBoxSize, setInsideBoxSize] = useState<number[]>([220, 220]) // 内框区域大小 [400, 400]
  const [data, setData] = useState<any>({})

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let eChart: echarts.ECharts
  let minute = 2880
  let heartRate = 220

  let generalWarnData = useRef<any[]>([])

  const [options] = useState<any>({
    grid: {
      show: true,
      borderWidth: 0
    },
    tooltip: {
      show: false,
      transitionDuration: 0
    },

    renderer: 'webgl', // 启用WebGL渲染
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 4
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 32,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: []
      }
    ],
    color: ['#c6e1fb', '#c7f1d7', '#f6e8e6', '#d3d5d4']
  })

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const { data } = await workbenchService.getSeverePositiveList()
    console.log('重阳比例统计', data)
    setData(data)
    getInitData([
      data.ventricularTachycardiaCount,
      data.atrialFibrillationCount,
      data.asystoleCount,
      data.tachycardiaCount
    ])
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
    //
    // updateChart(generalWarnData.current)
  }

  const updateChart = (data: number[]) => {
    const result = {
      ...options.series[0],
      data: [
        { value: data[0], name: '室速' },
        { value: data[1], name: '房颤' },
        { value: data[2], name: '3秒停搏' },
        { value: data[3], name: '心动过速' }
      ]
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

  return (
    <div className={cn(styles.severePositive)}>
      <div className={cn(styles.header)}>重阳比例</div>
      <div className={cn(styles.content)}>
        <div className={cn(styles.left)}>
          <div className={cn(styles.block)}>
            <div className={cn(styles.blockLeft)}>
              <div className={cn(styles.text)}>
                <Badge color="#BFE2FE" />
                <span className={cn(styles.title)}>室速</span>
              </div>
            </div>
            <div className={cn(styles.blockRight)}>
              {data.ventricularTachycardiaCount}
            </div>
          </div>
          <div className={cn(styles.block)}>
            <div className={cn(styles.blockLeft)}>
              <div className={cn(styles.text)}>
                <Badge color="#BCF3D5" />
                <span className={cn(styles.title)}>房颤</span>
              </div>
              <span className={cn(styles.describe)}>
                120bpm
                <ArrowUpOutlined style={{ color: '#ff0000', marginLeft: 4 }} />
              </span>
            </div>
            <div className={cn(styles.blockRight)}>
              {data.atrialFibrillationCount}
            </div>
          </div>
          <div className={cn(styles.block)}>
            <div className={cn(styles.blockLeft)}>
              <div className={cn(styles.text)}>
                <Badge color="#F9E7E6" />
                <span className={cn(styles.title)}>3秒停搏</span>
              </div>
            </div>
            <div className={cn(styles.blockRight)}>{data.asystoleCount}</div>
          </div>
          <div className={cn(styles.block)}>
            <div className={cn(styles.blockLeft)}>
              <div className={cn(styles.text)}>
                <Badge color="#D3D5D4" />
                <span className={cn(styles.title)}>心动过速</span>
              </div>
              <span className={cn(styles.describe)}>
                120bpm
                <ArrowUpOutlined style={{ color: '#ff0000', marginLeft: 4 }} />
              </span>
            </div>
            <div className={cn(styles.blockRight)}>{data.tachycardiaCount}</div>
          </div>
        </div>
        <div className={cn(styles.right)}>
          <div
            className={cn(styles.canvas)}
            ref={divRefs}
            style={{ width: insideBoxSize[0], height: insideBoxSize[1] }}
          />
        </div>
      </div>
    </div>
  )
})

export default SeverePositive
