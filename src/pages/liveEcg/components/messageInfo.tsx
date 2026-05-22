import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './messageInfo.less'
import { filterEventsType } from '@/utils'
import DayJS from 'dayjs'

interface Props {
  isVisible?: boolean
  data?: any[]
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}
const MessageInfo: React.FC<Props> = memo((props) => {
  const { isVisible = false, data, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible) {
      getList()
    }
  }, [isVisible])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
      // console.log('自动滚动到底部', contentRef.current.scrollTop)
    }
  }, [data])
  const getList = async () => {}

  const onSearch = (values: any) => {
    console.log('搜索了')
    getList()
  }

  const onReset = () => {
    console.log('重置')
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
    <>
      {isVisible && (
        <div className={cn(styles.messageInfo)}>
          <div className={cn(styles.header)}>
            <span>阳性事件播报</span>
          </div>
          <div className={cn(styles.content)} ref={contentRef}>
            {data?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cn(styles.item)}
                  onClick={() => onOpen(item)}
                >
                  <div className={cn(styles.itemContent)}>
                    <div className={cn(styles.time)}>
                      {DayJS(item.timestamp * 1000).format('HH:mm')}，
                    </div>
                    <div className={cn(styles.name)}>
                      {item.content?.username}，
                    </div>
                    <div className={cn(styles.type)}>
                      {filterEventsType(
                        Number(item.content?.metrics?.events[0].type)
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {/*<MiniProgramUserHistory*/}
      {/*  rowData={rowData}*/}
      {/*  isVisible={isVisibleHistory}*/}
      {/*  handleOk={handleNewOk}*/}
      {/*  handleCancel={() => setIsVisibleHistory(false)}*/}
      {/*/>*/}
    </>
  )
})

export default MessageInfo
