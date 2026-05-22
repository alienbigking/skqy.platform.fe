import React, { useEffect } from 'react'
import cn from 'classnames'
import styles from './workbench.less'
import { ContentWrapper } from '@/components/contentWrapper'

import { Form } from 'antd'
import Summary from '@/pages/workbench/components/summary'
import SeverePositive from '@/pages/workbench/components/severePositive'
import GeneralWarn from '@/pages/workbench/components/generalWarn'
import UptrendLine from '@/pages/workbench/components/uptrendLine'
import Statistics from '@/pages/workbench/components/statistics'
import LiveUser from '@/pages/workbench/components/liveUser'
import PositiveProportion from '@/pages/workbench/components/positiveProportion'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const Workbench: React.FC<Props> = (props) => {
  const {} = props

  const [form] = Form.useForm()

  useEffect(() => {}, [])

  return (
    <div className={cn(styles.workbench)}>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.topContent)}>
            <div className={cn(styles.left)}>
              {/*近期上线趋势*/}
              <UptrendLine />

              <Statistics />
            </div>
            <div className={cn(styles.middle)}>
              <Summary />
            </div>
            <div className={cn(styles.right)}>
              <LiveUser />
              <PositiveProportion />
            </div>
          </div>
          <div className={cn(styles.bottomContent)}>
            <SeverePositive />
            <GeneralWarn />
          </div>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default Workbench
