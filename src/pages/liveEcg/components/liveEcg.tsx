import React, { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import styles from './liveEcg.less'
import { Scrollbars } from 'react-custom-scrollbars-4'
import { ConfigProvider, Form, Input, message, Pagination, Tag } from 'antd'
import LiveEcgDetail from './liveEcgDetail'
import { IPagination } from '@/pages/common/types/common'
import {
  base64ToBinary,
  createPlaceholderItem,
  hex2Short,
  storage,
  symptomLabelOptions
} from '@/utils'
import { env } from '@/config/env'
import { cloneDeep } from 'lodash'
import { HeartRate } from '@/components/heartRate'
import {
  ECustomClassName,
  EHeartRateMode,
  EHeartRateType
} from '@/components/heartRate/types/heartRate'
import { commonService } from '@/pages/common/services'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import LiveEcgList from '@/pages/liveEcg/components/liveEcgList'
import Sidebar from './sidebar'
import MiniProgramUserHistory from '@/pages/miniProgramUser/components/miniProgramUserHistory'
import LiveEcgHeader from '@/pages/liveEcg/components/liveEcgHeader'
import Toolbar from '@/pages/liveEcg/components/toolbar'
import zhCN from 'antd/locale/zh_CN'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface DataType {
  [key: string]: any
}

let fs = 125
let audioSrc = require('../../../assets/sound/sound.wav')
let audioWarnSrc = require('../../../assets/sound/warnSound.wav')

const { Search } = Input

const LiveEcg: React.FC<Props> = (props) => {
  // const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleDetail, setIsVisibleDetail] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    // pageSize: 10
    pageSize: 18
  })
  const [socketUrl, setSocketUrl] = useState(
    `${env.WSS_URL}realtime-messaging/?token=${storage.getSession('token')}`
  )
  const [messageHistory, setMessageHistory] = useState([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [isOpenUserSound, setIsOpenUserSound] = useState(true)
  const [isOpenWarnSound, setIsOpenWarnSound] = useState(true)
  const [isVisibleLiveList, setIsVisibleLiveList] = useState(false)
  const [connectWebSocket, setConnectWebSocket] = useState(true)
  const [placeholderTableData, setPlaceholderTableData] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = React.useState<number[]>([])
  const [isVisibleMessageInfo, setIsVisibleMessageInfo] = useState(false)
  const [positiveEventInfo, setPositiveEventInfo] = useState<any[]>([])
  const [allDeviceOfflineInfo, setAllDeviceOfflineInfo] = useState<any[]>([])

  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [statisticsInfo, setStatisticsInfo] = useState<any>({})
  const [headerData, setHeaderData] = useState({})
  const [organizationName, setOrganizationName] = useState<string>('')

  const [isVisibleSidebar, setIsVisibleSidebar] = useState(false)

  const audioRef = useRef<any>(null)
  const audioWarnRef = useRef<any>(null)
  const liveEcgHeaderRef = useRef<any>(null)

  const inputRef = useRef<any>(null)
  const initTableDataRef = useRef<any>([])

  let reconnectInterval = 2000 // 重连间隔，比如2秒
  let reconnectAttempts = 0 // 重连尝试次数
  const maxReconnectAttempts = 3 // 最大重连尝试次数
  const previousTotalRef = useRef(0)
  const previousPageNumRef = useRef(1)
  const isInitialMount = useRef(true)

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  } = useWebSocket(
    `${env.WSS_URL}realtime-messaging/?token=${storage.getSession('token')}`,
    {
      share: true,
      reconnectInterval: 2000,
      reconnectAttempts: 3,
      onOpen: (event) => {
        handleSendMessage({
          conditions: [],
          pageNum: pagination.pageNum as number,
          pageSize: pagination.pageSize as number
        })
        console.log('WebSocket 打开了', event)
      },
      onMessage: (event) => {
        const values = JSON.parse(event.data)
        // console.log('WebSocket 接收到消息', values)

        values['isRedWarn'] = false
        values['isYellowWarn'] = false

        if (values.type === 1) {
          const newData = createDataEntry(values)

          // console.log('接收到心电数据', newData)

          // const updatedData = handleMergeMessage(cloneDeep(tableData), newData)

          const updatedData = handleType1DataUpdate(
            cloneDeep(tableData),
            newData
          )
          setTableData(updatedData)
        } else if (values.type === 2) {
          const newData = createInfoEntry(values)
          // console.log('接收到分析数据', newData)

          // const updatedData = handleMergeMessage(cloneDeep(tableData), newData)

          const updatedData = handleType2DataUpdate(
            cloneDeep(tableData),
            newData
          )
          setTableData(updatedData)
        } else if (values.type === 3) {
          // 分页消息

          const newData = createInfoEntry(values)
          // const updatedData = handleMergeMessage(cloneDeep(tableData), newData)

          const updatedData = handleType3DataUpdate(
            cloneDeep(tableData),
            newData
          )
          setTableData(updatedData)

          setTotal(values.content.total)
        } else if (values.type === 4) {
          // 统计信息
          setTotal(values.content?.onlineCount)

          setHeaderData((prevValue) => {
            return {
              ...prevValue,
              ...values?.content
            }
          })
        } else if (values.type === 5) {
          // 阳性事件
          handlePositiveEventInfo(values)
        } else if (values.type === 6) {
          // 设备离线
          const newData = createInfoEntry(values)
          // const updatedData = handleMergeMessage(cloneDeep(tableData), newData)

          const updatedData = handleType6DataUpdate(
            cloneDeep(tableData),
            newData
          )
          setTableData(updatedData)

          handledDeviceOfflineInfo(values)
        } else if (values.type === 7) {
          // 盒子下线（1、网络断开 2、盒子关机导致的下线）
          handleOfflineData(tableData, values)
        } else if (values.type === 8) {
          // 运动状态
          handleImuData(tableData, values)
        } else if (values.type === 9) {
          // 体温
          handleTemperatureData(tableData, values)
        } else if (values.type === 10) {
          // 关机
          handleShutDownData(tableData, values)
        }
      },
      onClose: (event) => {
        console.log('WebSocket 关闭了', event)

        // autoReconnect()
      },
      onError: (error) => {
        console.error('WebSocket 错误', error)
      },
      shouldReconnect: (event) => {
        console.log('应该自动重连', event)
        return true
      }
    },
    connectWebSocket
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState]

  const [form] = Form.useForm()

  useEffect(() => {
    initTableData()
    getUserInfo()

    console.log(
      '获取的socket地址及对象',
      `${env.WSS_URL}realtime-messaging/?token=${storage.getSession('token')}`,
      getWebSocket()
    )

    // mock数据
    // getMockDataList()
  }, [])

  useEffect(() => {
    if (placeholderTableData.length && !connectWebSocket) {
      setConnectWebSocket(true)
    }

    console.log(
      'placeholderTableData数据长度变化',
      placeholderTableData.length,
      tableData.length
    )
  }, [placeholderTableData.length]) // 当 tableData 更新时触发

  useEffect(() => {
    if (tableData.length) {
      const arr = cloneDeep(placeholderTableData)
      arr.map((item, index) => {
        item.isPlaceholder = index >= tableData.length
        return item
      })

      setPlaceholderTableData(arr)
    }
  }, [tableData.length])

  useEffect(() => {
    console.log(
      '总数',
      total,
      '前一次统计数量',
      previousTotalRef.current,
      '当前页码',
      pagination.pageNum,
      '前一次页码',
      previousPageNumRef.current,
      '当前所在页对应的总数量',
      pagination.pageSize! * pagination.pageNum!,
      '触发条件的值',
      pagination.pageSize! * pagination.pageNum! - pagination.pageSize!
    )

    if (
      total !== 0 &&
      total <=
        pagination.pageSize! * previousPageNumRef.current! -
          pagination.pageSize!
    ) {
      if (pagination.pageNum! < previousPageNumRef.current!) {
        console.log('自动触发分页条件')
        previousPageNumRef.current = pagination.pageNum!

        const conditions = handleConditions()

        handleSendMessage({
          conditions: conditions,
          pageNum: 1,
          pageSize: pagination.pageSize as number
        })
      }
    }
  }, [pagination.pageSize, pagination.pageNum])

  useEffect(() => {
    console.log('执行次数', total, pagination)
    if (
      total !== 0 &&
      total <= pagination.pageSize! * pagination.pageNum! - pagination.pageSize!
    ) {
      console.log('重新设置分页了', total, pagination)
      setPagination({
        pageNum: 1,
        pageSize: pagination.pageSize
      })
    }
    previousTotalRef.current = total
  }, [total])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      const conditions = handleConditions()
      handleSendMessage({
        conditions: conditions,
        pageNum: 1,
        pageSize: pagination.pageSize as number
      })
    }
  }, [selectedTags])

  const initTableData = () => {
    const arr = Array.from({ length: 18 }, (_, i) => createPlaceholderItem(i))

    setPlaceholderTableData(arr)
  }

  // 自动重连
  const autoReconnect = () => {
    setTimeout(() => {
      if (reconnectAttempts < maxReconnectAttempts) {
        console.log('尝试重新连接...')
        message.success('自动重连成功')
        reconnectAttempts++
      } else {
        console.log('重连失败，放弃连接')
        message.error('自动重连失败，请手动刷新')
      }
    }, reconnectInterval)
  }

  const getMockDataList = async () => {
    const res = await commonService.getMockData()
    console.log('获取的mock数据', res)
    setTableData(res.data.list.slice(0, 4))
  }

  const getUserInfo = async () => {
    commonService.getUserInfo().then((res) => {
      const { code, data } = res
      setOrganizationName(data.organizationName)
      console.log('用户信息', data)
    })
  }

  // 用户心电数据
  const handleType1DataUpdate = (existingData: any[], newData: any) => {
    if (existingData.length < 30) {
      const indexToReplace = existingData.findIndex(
        (item) => item.content.userId === newData.content.userId
      )

      if (indexToReplace !== -1) {
        existingData.splice(indexToReplace, 1, {
          ...newData,
          content: {
            ...existingData[indexToReplace].content,
            ...newData.content
          },
          temperature: existingData[indexToReplace]?.temperature,
          imu: existingData[indexToReplace]?.imu,
          isRedWarn: newData.isRedWarn,
          timestamp: newData.timestamp
        })
      } else {
        existingData.push(newData)
        liveEcgHeaderRef.current.playUserSound()
      }
    } else {
      // 移除第一个元素并添加新元素
      existingData.splice(0, 1)
      existingData.push(newData)
    }
    return existingData
  }

  // 分析结果
  const handleType2DataUpdate = (existingData: any[], newData: any) => {
    const setCenterInfo = liveEcgHeaderRef.current.getCenterInfo()
    // 心率超出阈值 发出警报声
    if (
      newData?.content?.metrics?.avgHr > setCenterInfo.tachycardiaThreshold ||
      newData?.content?.metrics?.avgHr < setCenterInfo.bradycardiaThreshold
    ) {
      newData['isRedWarn'] = true
      liveEcgHeaderRef.current.playWarnSound()
    }

    const indexToReplace = existingData.findIndex(
      (item) => item.content.userId === newData.content.userId
    )

    if (indexToReplace !== -1) {
      existingData[indexToReplace].content = {
        ...existingData[indexToReplace].content,
        ...newData.content
      }
      existingData[indexToReplace].isRedWarn = newData.isRedWarn
    }

    return existingData
  }

  // 分页数据
  const handleType3DataUpdate = (existingData: any[], newData: any) => {
    // 合并数据逻辑
    if (existingData.length) {
      // 更新当前页所有用户的基本信息及业务状态
      newData?.content?.list.forEach((newItem: any) => {
        for (let i = 0; i < existingData?.length; i++) {
          if (existingData[i].content.userId === newItem.id) {
            // console.log('当前的存在的用户数据', existingData[i])
            existingData[i].content = {
              ...existingData[i].content,
              ...newItem
            }
          }
        }
      })
    } else {
      newData?.content?.list.forEach((item: { id: any }, index: number) => {
        existingData.push({
          content: {
            ...item,
            userId: item.id
          },
          ecgData: [],
          // timestamp: newData.timestamp,
          type: newData.type
        })
      })
      console.log('类型为3初始化用户', existingData)
    }

    return existingData
  }

  // 盒子离线
  const handleType6DataUpdate = (existingData: any[], newData: any) => {
    const indexToReplace = existingData.findIndex(
      (item) => item.content.userId === newData.content.userId
    )

    if (indexToReplace !== -1) {
      existingData[indexToReplace].isYellowWarn = true
      liveEcgHeaderRef.current.playDeviceOffLineSound()
      console.log('设置为黄框了', existingData)
    } else {
      console.warn('未找到匹配用户，无法设置 isYellowWarn')
    }
    return existingData
  }
  // 4g网关盒子下线（断线）
  const handleOfflineData = (tableData: any, values: any) => {
    const index = tableData.findIndex(
      (item: { content: { userId: any } }) =>
        item?.content?.userId === values?.content?.userId
    )

    const result = [...tableData]
    result.splice(index, 1)
    console.log('设备下线----当前的用户索引值', index)

    const placeholderTableDataResult = placeholderTableData.map(
      (item: any, index: number) => {
        // 前 result.length 个位置标记为非占位
        item.isPlaceholder = index >= result.length
        return item
      }
    )
    console.log('设备下线----当前的用户数组', result)
    setTableData(result)
    setPlaceholderTableData(placeholderTableDataResult)
  }

  const handleImuData = (tableData: any, values: any) => {
    const result = tableData.filter((item: any) => {
      if (values.content.userId === item.content.userId) {
        item.imu = hex2Short(values?.content?.imu) //计算温度值
      }
      return item
    })
    setTableData(result)
  }
  const handleTemperatureData = (tableData: any, values: any) => {
    const result = tableData.filter((item: any) => {
      if (values.content.userId === item.content.userId) {
        //计算温度值
        item.temperature = (
          ((hex2Short(values?.content?.temperature) as number) * 7.8125) /
          1000
        ).toFixed(1)
      }
      return item
    })
    setTableData(result)
  }
  const handleShutDownData = (tableData: any, values: any) => {
    const currentIndex = tableData.findIndex(
      (item: { content: { userId: any } }) =>
        item?.content?.userId === values?.content?.userId
    )
    console.log('设备关机----当前下线的用户索引值', currentIndex)

    const result = [...tableData]
    result.splice(currentIndex, 1)
    console.log('设备关机----当前下线的用户索引值', result)
    console.log('当前占位人数', placeholderTableData)

    const placeholderTableDataResult = placeholderTableData.map(
      (item: any, index: number) => {
        // 前 result.length 个位置标记为非占位
        item.isPlaceholder = index >= result.length
        return item
      }
    )

    setTableData(result)
    setPlaceholderTableData(placeholderTableDataResult)
  }
  const handleMessageInfo = (value: any) => {
    console.log('点击的用户', value)
    setRowData({ id: value.content.userId })
    setIsVisibleHistory(true)
  }

  // 数据
  const createDataEntry = (newData: { content: any; timestamp?: any }) => ({
    ...newData,
    customClassName: ECustomClassName.showHeartRate,
    // createAt: newData.timestamp,
    ecgData: base64ToBinary(newData.content?.original)
  })
  // 分析结果
  const createInfoEntry = (newData: any) => ({
    ...newData
  })

  const onDetail = (value: any) => {
    // setIsVisibleDetail(true)
    // setRowData(value)

    setIsVisibleHistory(true)
    setRowData({ id: value.content.userId })
  }

  const handleOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleDetail(false)
    setIsVisibleHistory(false)
  }

  // 打开实时最近在线用户列表
  const onOpenLiveList = () => {
    setIsVisibleLiveList(true)
  }

  const handleLongTime = (params: any) => {
    const data = cloneDeep(tableData)
    data.forEach((item, index) => {
      if (item.content.userId === params.userId) {
        data.splice(index, 1)
      }
    })

    setTableData(data)

    console.log('父组件处理长时间未接收数据的子组件事件', params)
  }

  const onChange = (page: number, pageSize: number) => {
    previousPageNumRef.current = page
    console.log('设置前一次页码了', previousPageNumRef.current)

    setPagination({
      pageNum: page,
      pageSize: pageSize
    })
  }

  const onPageSizeChange = (current: any, pageSize: number) => {
    console.log('触发切页动作了----切换分页大小了', current, pageSize)

    const conditions = handleConditions()

    handleSendMessage({
      conditions: conditions,
      pageNum: 1,
      pageSize
    })

    setPagination({
      pageNum: current,
      pageSize: pageSize
    })
  }

  const handleSendMessage = (params: {
    conditions: any[]
    pageNum: number
    pageSize: number
  }) => {
    setTableData([])
    initTableData()

    sendJsonMessage({
      type: 3,
      content: {
        conditions: params.conditions,
        pageNum: params.pageNum,
        pageSize: params.pageSize
      }
    })
  }

  const onTagChange = (value: number, checked: boolean) => {
    console.log('tag', value, checked)

    const allSelectedTags = checked
      ? [...selectedTags, value]
      : selectedTags.filter((tag) => tag !== value)

    setSelectedTags(cloneDeep(allSelectedTags))

    console.log('所有选中的标签', allSelectedTags)
  }

  const handlePositiveEventInfo = (data: any) => {
    let result = cloneDeep(positiveEventInfo)

    if (result.length < 50) {
      result.push(data)
    } else {
      result.splice(0, 1)
      result.push(data)
    }

    setPositiveEventInfo(result)
  }
  const handledDeviceOfflineInfo = (data: any) => {
    let allData = cloneDeep(allDeviceOfflineInfo)

    if (allData.length < 50) {
      allData.push(data)
    } else {
      allData.splice(0, 1)
      allData.push(data)
    }
    setAllDeviceOfflineInfo(allData)
  }

  const handleUserInfo = (value: any) => {
    console.log('接收到用户信息', value)
    setRowData(value)
    setIsVisibleHistory(true)
  }

  const handleConditions = useCallback(() => {
    console.log('获取的标签值', selectedTags)
    return selectedTags.map((value) => ({
      type: String(value)
    }))
  }, [selectedTags])

  const handleSetCenterInfo = (value: any) => {
    console.log('获取到子组件的信息了', value)
    setIsVisibleSidebar(value.sidebarUserList)
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className={cn(styles.liveEcg)}>
        <div className={cn(styles.title)}>{organizationName}实时心电监测</div>

        <div className={cn(styles.contentContainer)}>
          {isVisibleSidebar && (
            <Scrollbars
              className={cn(['gScrollbar'])}
              style={{ width: '238px' }}
              autoHide
            >
              <Sidebar handleOk={(value) => handleUserInfo(value)} />
            </Scrollbars>
          )}

          <div className={cn(styles.main)}>
            <LiveEcgHeader
              ref={liveEcgHeaderRef}
              data={headerData}
              openLiveList={onOpenLiveList}
              updateSetCenterInfo={handleSetCenterInfo}
            />

            <div className={cn(styles.content)}>
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
              <Scrollbars
                className={cn(['gScrollbar'])}
                style={{ width: '100%' }}
                autoHide
              >
                <div className={cn(styles.ecgContainer)}>
                  {tableData?.map((item, index) => (
                    <div
                      className={cn(styles.item)}
                      key={item?.content?.userId}
                      onClick={() => onDetail(item)}
                    >
                      <HeartRate
                        key={item?.content?.userId}
                        mode={EHeartRateMode.realTimeMode}
                        customClassName={item.customClassName}
                        isShowRedWarnBox={item.isRedWarn}
                        isShowYellowWarnBorder={item.isYellowWarn}
                        type={EHeartRateType.fiveSecHeartRate}
                        dataSource={item}
                        longTimeNotReceivedDataFn={handleLongTime}
                      />
                    </div>
                  ))}

                  {placeholderTableData?.map(
                    (item: any, index: number) =>
                      item.isPlaceholder && (
                        <div className={cn(styles.item)} key={index}>
                          <HeartRate
                            key={index}
                            mode={EHeartRateMode.realTimeMode}
                            customClassName={item.customClassName}
                            isShowRedWarnBox={item.isRedWarn}
                            isShowYellowWarnBorder={item.isYellowWarn}
                            type={EHeartRateType.fiveSecHeartRate}
                            dataSource={item}
                          />
                        </div>
                      )
                  )}
                </div>
              </Scrollbars>
              <div
                className={cn([
                  styles.footer,
                  !isVisibleSidebar ? styles.hideSidebarFooter : ''
                ])}
              >
                <Pagination
                  defaultCurrent={1}
                  total={total}
                  current={pagination.pageNum}
                  pageSize={pagination.pageSize}
                  // pageSizeOptions={[10, 18]}
                  pageSizeOptions={[18]}
                  showQuickJumper
                  onChange={onChange}
                  onShowSizeChange={onPageSizeChange}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </div>
        </div>

        <LiveEcgDetail
          rowData={rowData}
          isVisible={isVisibleDetail}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleDetail(false)}
        />

        <LiveEcgList
          isVisible={isVisibleLiveList}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleLiveList(false)}
        />

        <MiniProgramUserHistory
          rowData={rowData}
          isVisible={isVisibleHistory}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleHistory(false)}
        />

        {/*工具悬浮栏*/}
        <Toolbar
          data={{
            messageInfo: positiveEventInfo,
            deviceOfflineInfo: allDeviceOfflineInfo
          }}
          handleCallback={{
            handleMessageInfo: (value: any) => handleMessageInfo(value)
          }}
        />
      </div>
    </ConfigProvider>
  )
}

export default LiveEcg
