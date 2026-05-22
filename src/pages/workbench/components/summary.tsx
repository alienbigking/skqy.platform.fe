import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './summary.less'
import { workbenchService } from '@/pages/workbench/services'
import { formatNumberWithCommas } from '@/utils'
import { GeoChoroplethAndScatter } from '@/components/advancedMap'

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
const Summary: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const [data, setData] = useState<any>({})

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let generalWarnData = useRef<any[]>([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const { data } = await workbenchService.getOverviewList()
    console.log('系统总览', data)
    setData(data)
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
    <div className={cn(styles.summary)}>
      <div className={cn(styles.summaryHeader)}>
        <div className={cn(styles.summaryTitle)}>累计总诊断量</div>
        <div className={cn(styles.number)}>
          {formatNumberWithCommas(data?.monitorCount || 0)}
        </div>
      </div>

      <div className={cn(styles.map)}>
        {/*<img src={require('@/assets/images/statisticsBg.png')} alt="地图" />*/}
        {/*<InitAMap />*/}
        <GeoChoroplethAndScatter />
      </div>
      <div className={cn(styles.types)}>
        <div className={cn([styles.block, styles.reportNumber])}>
          <div className={cn(styles.top)}>
            <div className={cn(styles.title)}>累计出具报告数</div>
            <div className={cn(styles.value)}>{data?.reportCount}</div>
          </div>
          <div className={cn(styles.bottom)}>
            <img src={require('@/assets/images/reportNumber.png')} alt="" />
          </div>
        </div>
        <div className={cn([styles.block, styles.time])}>
          <div className={cn(styles.top)}>
            <div className={cn(styles.title)}>累计总诊断时长</div>
            <div className={cn(styles.value)}>{data?.durationCount}</div>
          </div>
          <div className={cn(styles.bottom)}>
            <img src={require('@/assets/images/time.png')} alt="" />
          </div>
        </div>
        <div className={cn([styles.block, styles.headcount])}>
          <div className={cn(styles.top)}>
            <div className={cn(styles.title)}>注册总人数</div>
            <div className={cn(styles.value)}>{data?.registerCount}</div>
          </div>
          <div className={cn(styles.bottom)}>
            <img src={require('@/assets/images/headcount.png')} alt="" />
          </div>
        </div>
        <div className={cn([styles.block, styles.warnNumber])}>
          <div className={cn(styles.top)}>
            <div className={cn(styles.title)}>累计总预警数</div>
            <div className={cn(styles.value)}>{data?.eventsCount}</div>
          </div>
          <div className={cn(styles.bottom)}>
            <img src={require('@/assets/images/warnNumber.png')} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
})

export default Summary
