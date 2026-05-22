import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './uptrendLine.less'
import { workbenchService } from '../services'

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
const UptrendLine: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const [dataList, setDataList] = useState<any[]>([])
  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let generalWarnData = useRef<any[]>([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const { data } = await workbenchService.getRankingList()
    console.log('机构排名', data)
    setDataList(data)
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
    <div className={cn(styles.uptrendLine)}>
      <div className={cn(styles.header)}>近期上线趋势</div>
      <div className={cn(styles.content)}>
        {/*机构排名*/}
        <div className={cn(styles.organizationRanking)}>
          <div className={cn(styles.organizationHeader)}>
            <div className={cn(styles.rankingTitle)}>排名</div>
            <div className={cn(styles.organizationTitle)}>机构</div>
          </div>
          <div className={cn(styles.organizationContent)}>
            {dataList?.map((item, index) => {
              return (
                <div key={index} className={cn(styles.item)}>
                  <div className={cn(styles.rankingNumber)}>{index + 1}</div>
                  <div className={cn(styles.organizationName)}>{item.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
})

export default UptrendLine
