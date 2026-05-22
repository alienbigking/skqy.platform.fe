import React, { memo, useEffect, useRef, useState } from 'react'
import { cloneDeep } from 'lodash'
import * as echarts from 'echarts'
import cn from 'classnames'
import styles from './heartRate.less'
// import largeImageY from '@/assets/images/img.png'
// import largeImageX from '@/assets/images/img_1.png'
import {
  ECustomClassName,
  EHeartRateMode,
  EHeartRateType
} from '../types/heartRate'
// import emitter from '../../../utils/event'
import { pairs } from 'd3-array'
import { HeartFilled } from '@ant-design/icons'
import { filterEventsType, gender } from '@/utils'
import { filterImuState } from '@/utils/filters'

interface Props {
  mode?: EHeartRateMode
  type?: EHeartRateType
  isShowUserInfo?: boolean
  customClassName?: ECustomClassName
  isShowRedWarnBox?: boolean
  isShowYellowWarnBorder?: boolean
  dataSource?: any
  longTimeNotReceivedDataFn?: (params: any) => void
}

let fs = 125

const HeartRate: React.FC<Props> = memo((props) => {
  const {
    mode = EHeartRateMode.realTimeMode,
    type = EHeartRateType.fiveSecHeartRate,
    isShowUserInfo = true,
    customClassName,
    isShowRedWarnBox,
    isShowYellowWarnBorder,
    dataSource,
    longTimeNotReceivedDataFn
  } = props

  const divRefs = useRef<HTMLDivElement | any>(null)
  const canvasRefs = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState<number[]>([0, 0]) // 画布大小 [450, 450]
  const [outerBoxSize, setOuterBoxSize] = useState<number[]>([0, 0]) // 外框大小 [420, 420]
  const [insideBoxSize, setInsideBoxSize] = useState<number[]>([0, 0]) // 内框区域大小 [400, 400]

  const isFirstRender = useRef(true)
  const [isBoxRenderComplete, setIsBoxRenderComplete] = useState(false)
  const [isWorkerComplete, setIsWorkerComplete] = useState(false)

  let ecgData = useRef<any[]>([])
  const myWorkerRef = useRef<any>()

  let sec =
    type === EHeartRateType.thirtySecHeartRate
      ? 30
      : type === EHeartRateType.tenSecHeartRate
      ? 10
      : 5
  // console.log('秒数', sec)
  // 矩阵绘制的点的数量
  const xyArr = Array.from(
    // 这里的数值表示绘制的区域大小width,表示在这么宽的区域能绘制多少数据点
    Array(fs * sec + 1).keys(),
    (n) => n
  )
  // let eChart: echarts.ECharts = useRef(null)
  let eChart = useRef<echarts.ECharts | null>(null)

  let ecgWaveformTimer: string | number | NodeJS.Timeout | undefined
  let longTimeTimer: string | number | NodeJS.Timeout | undefined

  const [options] = useState<any>({
    grid: {
      show: true,
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px',
      borderWidth: 0
      // containLabel: true
    },
    tooltip: {
      show: false,
      // transitionDuration: 0,
      axisPointer: {
        animation: false // 禁用动画
      }
    },
    yAxis: {
      type: 'category',
      data: xyArr,
      show: false,
      max: 220,
      min: -100,
      axisLabel: {},
      splitLine: {}
    },
    xAxis: {
      type: 'category',
      data: xyArr,
      show: false,
      splitLine: {}
    },
    renderer: 'webgl', // 启用WebGL渲染
    animation: false,
    animationDelay: 0,
    animationDurationUpdate: 0,
    series: [
      {
        type: 'line',
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
    if (isShowYellowWarnBorder) {
      console.log('设置信号中断出现黄框时清除波形数据', isShowYellowWarnBorder)
      updateChart([])
    }
  }, [isShowYellowWarnBorder])

  useEffect(() => {
    if (type) {
      initBox()
    }
  }, [type])

  useEffect(() => {
    if (canvasSize.length && outerBoxSize.length && insideBoxSize.length) {
      // console.log('监听到心电框的变化了')
      drawBox(canvasSize, outerBoxSize, insideBoxSize)
      setIsBoxRenderComplete(true)
      setIsWorkerComplete(true)
    }
  }, [canvasSize, outerBoxSize, insideBoxSize])

  useEffect(() => {
    if (isWorkerComplete) {
      if (!myWorkerRef.current) {
        //  && dataSource?.ecgData.length
        // console.log('worker加载了并且数据接受到', dataSource)

        myWorkerRef.current = new Worker(
          new URL('@/workers/ecg.ts', import.meta.url)
        )
      }

      return () => {
        myWorkerRef.current?.terminate()
        eChart.current?.dispose()
      }
    }
  }, [isWorkerComplete])

  useEffect(() => {
    // console.log(
    //   '是否首次渲染',
    //   isFirstRender.current,
    //   '渲染模式',
    //   mode,
    //   '数据源',
    //   dataSource
    // )
    if (isBoxRenderComplete) {
      if (
        isFirstRender.current &&
        mode === EHeartRateMode.realTimeMode &&
        dataSource?.timestamp
      ) {
        // console.log('实时波形组件接收的数据', dataSource)
        // 实时波形 首次渲染填充5s的空数据
        if (
          type === EHeartRateType.fiveSecHeartRate &&
          dataSource?.ecgData.length
        ) {
          const filledArray = new Array(fs * 5).fill('-')
          initEcharts([...filledArray, ...(dataSource?.ecgData as number[])])
        }

        isFirstRender.current = false // 标记为非首次渲染
      } else if (dataSource?.ecgData?.length) {
        // console.log('预览模式及实时模式非首次组件接收的数据', dataSource)

        initEcharts(dataSource?.ecgData as number[])
      }

      // 每次接收到新的数据时应停止该计时器
      clearTimeout(longTimeTimer)
    }

    return () => {
      // 在组件销毁时执行清理操作
      clearTimeout(longTimeTimer)
      clearInterval(ecgWaveformTimer)
    }
  }, [dataSource.timestamp, isBoxRenderComplete])

  const initEcharts = (data: number[]) => {
    getInitData(data)
  }

  const initBox = () => {
    // 按天时的散点图
    // 224*224 外框
    // 212*212 内框
    // 默认外边框上下左右边距为30
    if (type === EHeartRateType.thirtySecHeartRate) {
      setCanvasSize([2880, 114]) // [480, 480]
      setOuterBoxSize([2880, 114])
      setInsideBoxSize([2880, 114])
    } else if (type === EHeartRateType.tenSecHeartRate) {
      setCanvasSize([960, 114]) // [254, 254]
      setOuterBoxSize([960, 114])
      setInsideBoxSize([960, 114])
    } else if (type === EHeartRateType.fiveSecHeartRate) {
      setCanvasSize([480, 114]) // [254, 254]
      setOuterBoxSize([480, 114])
      setInsideBoxSize([480, 114])
    }
    // console.log('绘制类型', type)
  }

  // 绘制框
  const drawBox = (
    canvasSize: number[],
    outerBoxSize: number[],
    insideBoxSize: number[]
  ) => {
    const canvas = canvasRefs.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    // 绘制外框、刻度线、刻度值#105144 #004134
    drawOuterBox(canvasSize, outerBoxSize, insideBoxSize, ctx, '#0E6C5E', 1) // #00FF00

    // 绘制内线条
    // if (
    //   type === EHeartRateType.thirtySecHeartRate ||
    //   type === EHeartRateType.tenSecHeartRate ||
    //   type === EHeartRateType.fiveSecHeartRate
    // ) {
    //   drawInsideBox(
    //     canvasSize,
    //     outerBoxSize,
    //     insideBoxSize,
    //     ctx,
    //     '#646464',
    //     0.4
    //   )
    // }
  }
  // 绘制外层的线框及刻度线、刻度值
  const drawOuterBox = (
    canvasSize: number[],
    outerBoxSize: number[],
    insideBoxSize: number[],
    ctx: any,
    color: string,
    lineWidth: number
  ) => {
    let leftDistance = 0 // 外框距离左边30px
    let rightDistance = 0 // 外框距离右边边30px
    let topDistance = 0 //外框距离顶部30px
    let insideOutsideDistance = (outerBoxSize[0] - insideBoxSize[0]) / 2 // 内外框距离

    let xGridNumber =
      type === EHeartRateType.thirtySecHeartRate
        ? 150
        : type === EHeartRateType.tenSecHeartRate
        ? 50
        : type === EHeartRateType.fiveSecHeartRate
        ? 25
        : 50
    let yGridNumber =
      type === EHeartRateType.thirtySecHeartRate
        ? 6
        : type === EHeartRateType.tenSecHeartRate
        ? 6
        : type === EHeartRateType.fiveSecHeartRate
        ? 6
        : 6
    //控制渲染几个刻度
    // let scaleLineTextData = getScaleLineTextData()
    let xIndex = 0 // 遍历次数
    let yIndex = 0 // 遍历次数

    // 清除路径
    ctx.beginPath()
    // 设置绘制颜色
    ctx.strokeStyle = color
    // 设置绘制线段的宽度
    ctx.lineWidth = lineWidth

    ctx.strokeRect(0, 0, outerBoxSize[0], outerBoxSize[1])

    /*
     * 以30s心率图为例
     * x轴线
     * 140 框的高
     * */
    for (let i = 0; i < outerBoxSize[1]; i += outerBoxSize[1] / yGridNumber) {
      // 清除路径
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(outerBoxSize[0], i)
      ctx.stroke()
      yIndex++
    }

    /*
     * 以30s心率图为例
     * y轴线
     * 40横轴的起点的坐标 30(leftDistance) + 10(insideOutsideDistance)
     * 1132 画布的宽
     * */
    for (let i = 0; i < canvasSize[0]; i += outerBoxSize[0] / xGridNumber) {
      // 清除路径
      ctx.beginPath()
      ctx.moveTo(i, outerBoxSize[1]) //outerBoxSize[0]
      ctx.lineTo(i, 0) // outerBoxSize[0]
      ctx.stroke()
      xIndex++
    }

    // ctx.stroke()
    // // 清除路径
    // ctx.beginPath()
  }

  // 绘制内部的线条
  const drawInsideBox = (
    canvasSize: number[],
    outerBoxSize: number[],
    insideBoxSize: number[],
    ctx: any,
    color: string,
    lineWidth: number
  ) => {
    let leftDistance = 0 // 外框距离左边30px
    let rightDistance = 0 // 外框距离右边边30px
    let topDistance = 0 //外框距离顶部30px

    let insideOutsideDistance = (outerBoxSize[0] - insideBoxSize[0]) / 2 // 内外框距离
    let xGridNumber =
      type === EHeartRateType.thirtySecHeartRate
        ? 150
        : type === EHeartRateType.tenSecHeartRate
        ? 50
        : type === EHeartRateType.fiveSecHeartRate
        ? 25
        : 50
    let yGridNumber =
      type === EHeartRateType.thirtySecHeartRate
        ? 6
        : type === EHeartRateType.tenSecHeartRate
        ? 6
        : 6

    let smallGridWidthSize = insideBoxSize[0] / xGridNumber / 5
    let smallGridHeightSize = insideBoxSize[1] / yGridNumber / 5

    // 清除路径
    ctx.beginPath()
    // 设置绘制颜色
    ctx.strokeStyle = color
    // 设置绘制线段的宽度
    ctx.lineWidth = lineWidth

    //绘制x轴 竖线
    for (let i = 0; i < insideBoxSize[0]; i += smallGridWidthSize) {
      if (i !== smallGridWidthSize * 5) {
        // 设置虚线样式，数组中的值代表虚线的间隔
        // ctx.setLineDash([5, 2])

        // 清除路径
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, insideBoxSize[1])
        // 绘制坐标轴
        ctx.stroke()
      }
    }

    //绘制y轴 横线
    for (let i = 0; i < insideBoxSize[1]; i += smallGridHeightSize) {
      if (i !== smallGridHeightSize * 5) {
        // 设置虚线样式，数组中的值代表虚线的间隔
        // ctx.setLineDash([5, 2])

        // 清除路径
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(insideBoxSize[0], i)
        // 绘制坐标轴
        ctx.stroke()
      }
    }
  }

  const getInitData = (data: number[]) => {
    ecgData.current = []
    ecgData.current = cloneDeep(data)
    // console.log('heartRate组件获取的数据', ecgData.current)

    if (eChart.current) {
      // eChart.current?.clear()
      // eChart.current?.dispose()
      // eChart.current = null
      // console.log('接收到新数据时清除之前的已绘制的波形')
    }

    if (!eChart.current) {
      console.log('eChart初始化')
      eChart.current = echarts.init(divRefs.current as HTMLDivElement)
    }

    handleHeartRateMode() //allLineChartData
  }
  const handleHeartRateMode = () => {
    if (mode === EHeartRateMode.realTimeMode) {
      // 渲染移动心电波形
      clearInterval(ecgWaveformTimer)
      drawEcgWaveform()
      // console.log('实时模式')
    } else {
      updateChart(ecgData.current)
      console.log('预览模式')
    }
  }
  // 绘制活动的心电波形
  const drawEcgWaveform = async () => {
    // console.log('drawEcgWaveform函数调用次数')

    // console.log('当前的worker线程及数据', myWorkerRef, '数据', ecgData.current)
    // 向 Worker 发送消息
    if (myWorkerRef.current) {
      myWorkerRef.current.postMessage({
        fs: fs,
        ecgData: ecgData.current
      })

      // 监听来自 Worker 的消息
      myWorkerRef.current.onmessage = (event: {
        data: {
          action: string
          ecgData: number[]
        }
      }) => {
        updateChart(event.data.ecgData)
      }
    }
  }

  const updateChart = (data: number[]) => {
    const result = {
      ...options.series[0],
      data: data
    }

    if (eChart.current) {
      eChart.current!.setOption(
        {
          ...options,
          series: [result]
        },
        // true
        { replaceMerge: ['series'] }
      )
    }
  }

  // 当组件长时间未接收到新的数据时应发送通知
  const handleLongTimeNotReceivedData = () => {
    longTimeTimer = setTimeout(() => {
      longTimeNotReceivedDataFn?.({
        userId: dataSource.content.userId
      })
    }, 60 * 1000)
  }

  const getScaleLineTextData = () => {
    let scaleLineTextData = []

    switch (type) {
      case EHeartRateType.thirtySecHeartRate:
        scaleLineTextData = [0, 1000, 2000, 3000]
        break
      case EHeartRateType.tenSecHeartRate:
        scaleLineTextData = [0, 500, 1000, 1500, 2000]
        break
      default:
        scaleLineTextData = [0, 1000, 2000, 3000]
        break
    }
    return scaleLineTextData
  }
  // 绘制坐标轴数字
  const rotateText = (
    ctx: any,
    x: number,
    y: number,
    text: number | string,
    angle: number,
    isYAxis: boolean
  ) => {
    const { width } = ctx.measureText(text)
    // console.log('当前文本值', x, y, text)

    ctx.save()
    ctx.beginPath()
    rotateAngle(ctx, x, y, angle)
    ctx.font = '14px Georgia'
    if (isYAxis) {
      // 是否为Y轴
      ctx.fillText(String(text), x - (width + 2) / 2, y - 2)
    } else {
      ctx.fillText(String(text), x, y)
    }
    // ctx.stroke()
    ctx.restore()
    // ctx.closePath()
    ctx.beginPath()
  }
  // 确保是以(x,y)为中心进行旋转，而不是简单的以画布原点旋转
  const rotateAngle = (ctx: any, x: number, y: number, degree: number) => {
    ctx.translate(x, y)
    ctx.rotate((degree * Math.PI) / 180)
    ctx.translate(-x, -y)
  }

  // 处理折线图的坐标
  const handleLineChartCoordinate = (allLineChartData: number[]) => {
    let largeGridHeight = 140 / 6
    const data = allLineChartData.map((value) => {
      // if (value === 0) {
      //   return '-' // -表示渲染折线图，默认情况下0也会渲染出线条
      // }
      // return canvasSize[1] / 1.5 - (value / 108) * 2 * largeGridHeight
      return value
    })
    return data
  }
  const drawAnnTextValue = (
    canvasSize: number[],
    outerBoxSize: number[],
    insideBoxSize: number[],
    color: string,
    lineWidth: number,
    samplingPositionArr: any[],
    typeArr: string[]
  ) => {
    const canvas = canvasRefs.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    // 获取采样点位置的差值
    let differenceSamplingPointArr = pairs(samplingPositionArr, (a, b) => b - a)
    console.log('获取的采样点位置差值', differenceSamplingPointArr)
    // let numberRate = profileInfoStore.fs === 250 ? 4 : 8 // 差值转为时间间隔所用的值 4=1000/250 8=1000/125    1000表示1000毫秒 250表示采样率
    // 每毫秒的采样点数量
    let numberRate = 1000 / fs // 乘以4（毫秒）等价于认为采样率是250，当采样率是125时，这里得乘以8（毫秒） = 1000毫秒 / 125次
    // 每10s采样点数量
    // let samplingPointNumber = profileInfoStore.fs === 250 ? 2500 : 1250
    let samplingPointNumber = fs * 10
    let xIndex = 0 // 遍历次数
    let yIndex = 0 // 遍历次数

    // 设置绘制颜色
    ctx.strokeStyle = color
    // 设置绘制线段的宽度
    ctx.lineWidth = lineWidth

    /*
     * 以30s心率图为例
     * x轴线
     * 140 框的高
     * */
    for (let i = 0; i < samplingPositionArr.length; i++) {
      ctx.moveTo(
        (canvasSize[0] / samplingPointNumber) * Number(samplingPositionArr[i]),
        30
      )
      ctx.lineTo(
        (canvasSize[0] / samplingPointNumber) * Number(samplingPositionArr[i]),
        40
      )
      ctx.stroke()
      ctx.beginPath()

      // 绘制类型
      rotateText(
        ctx,
        (canvasSize[0] / samplingPointNumber) * Number(samplingPositionArr[i]),
        15,
        typeArr[i],
        0,
        true
      )
      // 绘制数字
      rotateText(
        ctx,
        (canvasSize[0] / samplingPointNumber) * Number(samplingPositionArr[i]) +
          (Number(differenceSamplingPointArr[i]) / 2) *
            (canvasSize[0] / samplingPointNumber),
        15,
        (differenceSamplingPointArr[i] / fs) * 1000, //
        0,
        true
      )

      yIndex++
    }
  }

  const onDetail = () => {}

  return (
    <div className={cn([styles.heartRate, customClassName])}>
      <div className={cn([styles.maskLayer])} onClick={onDetail}>
        <div
          className={cn([
            styles.placeholder,
            isShowRedWarnBox ? styles.redWarnBorder : '',
            isShowYellowWarnBorder ? styles.yellowWarnBorder : ''
          ])}
          style={{
            width: canvasSize[0] + 2
          }}
        >
          {isShowUserInfo && (
            <div className={cn(styles.header)}>
              <div className={cn(styles.left)}>
                <div className={cn(styles.basicInfo)}>
                  <div className={cn(styles.name)}>
                    <span>{dataSource?.content?.username}</span>
                  </div>
                  <span className={cn(styles.gender)}>
                    {gender(dataSource?.content?.gender)}
                  </span>
                  <span>{dataSource?.content?.age}</span>
                </div>

                {/*<div className={cn(styles.symptom)}>*/}
                {/*  <span>病史：</span>*/}
                {/*  <span>*/}
                {/*    {dataSource?.content?.labels?.map(*/}
                {/*      (item: any, index: number) => (*/}
                {/*        <span key={index}>*/}
                {/*          {index < 4 ? item.name : ''}*/}
                {/*          {index < dataSource?.content?.labels.length - 1 &&*/}
                {/*          index < 3*/}
                {/*            ? '、'*/}
                {/*            : ''}*/}
                {/*        </span>*/}
                {/*      )*/}
                {/*    )}*/}
                {/*  </span>*/}
                {/*</div>*/}
              </div>
              <div className={cn(styles.right)}>
                <div className={cn(styles.heart)}>
                  <div className={cn(styles.posture)}>
                    <span className={cn(['iconfont', 'icon-titai'])}></span>
                    <span className={cn(styles.motionState)}>
                      {filterImuState(dataSource?.imu)}
                    </span>
                  </div>
                  <div className={cn(styles.temp)}>
                    <span
                      className={cn(['iconfont', 'icon-rentiwendu'])}
                    ></span>
                    <span className={cn(styles.tempNumber)}>
                      {dataSource.temperature ? dataSource.temperature : '--'}
                      &nbsp; °C
                    </span>
                  </div>
                  <div className={cn(styles.bpm)}>
                    BPM <HeartFilled />
                  </div>
                  <div className={cn(styles.heartNumber)}>
                    {dataSource?.content?.metrics?.avgHr
                      ? dataSource?.content?.metrics?.avgHr
                      : 0}
                  </div>
                </div>
                {dataSource?.content?.metrics?.events &&
                  dataSource?.content?.metrics?.events.length > 0 && (
                    <div className={cn(styles.messageInfo)}>
                      <span>
                        {filterEventsType(
                          Number(dataSource?.content?.metrics?.events[0]?.type)
                        )}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div
            className={cn([
              styles.heartRateContent,
              !isShowUserInfo && styles.resetHeartRate
            ])}
          >
            <div
              className={cn(
                type === EHeartRateType.thirtySecHeartRate
                  ? styles.thirtySecHeartRate
                  : type === EHeartRateType.fiveSecHeartRate
                  ? styles.fiveSecHeartRate
                  : type === EHeartRateType.tenSecHeartRate
                  ? styles.tenSecHeartRate
                  : ''
              )}
              ref={divRefs}
              style={{ width: insideBoxSize[0], height: insideBoxSize[1] }}
            />
            {/*散点图外框及内框*/}
            <canvas
              className={cn(styles.heartRateBox)}
              ref={canvasRefs}
              width={canvasSize[0]}
              height={canvasSize[1]}
            ></canvas>
            {isShowYellowWarnBorder && (
              <div className={cn(styles.promptInfo)}>
                <span className={cn(styles.deviceDisconnect)}>
                  设备连接中断
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default HeartRate
