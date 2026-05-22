import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './positiveProportion.less'
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
const PositiveProportion: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const [data, setData] = useState<any>({})
  const [proportion, setProportion] = useState<any[]>([])
  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let generalWarnData = useRef<any[]>([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const { data } = await workbenchService.getPositiveProportionList()
    console.log('阳性比例', data)
    let total = data?.genderCounts.reduce(
      (accumulator: any, currentValue: { count: number }) => {
        return accumulator + currentValue.count
      },
      0
    )
    console.log('总数量', total)

    const result = data?.genderCounts.map((item: any) => {
      return ((item.count / total) * 100).toFixed(2) // 保留两位小数
    })
    console.log('比例', result)
    // setData(data)
    setProportion(result)
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
    <div className={cn(styles.positiveProportion)}>
      <div className={cn(styles.header)}>阳性比例</div>
      <div className={cn(styles.content)}>
        <div className={cn(styles.top)}>
          <span>男性</span>
          <span>女性</span>
        </div>
        <div className={cn(styles.bottom)}>
          <div className={cn(styles.proportion)}>
            <div
              className={cn(styles.manNumber)}
              style={{ width: proportion[0] + '%' }}
            ></div>
            <div
              className={cn(styles.womanNumber)}
              style={{ width: proportion[1] + '%' }}
            ></div>
          </div>
          <div className={cn(styles.text)}>
            <span>{proportion[0] ? proportion[0] + '%' : ''}</span>
            <span>{proportion[1] ? proportion[1] + '%' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default PositiveProportion
