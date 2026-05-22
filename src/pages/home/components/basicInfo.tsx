import React, { memo } from 'react'
import cn from 'classnames'
import styles from './basicInfo.less'

interface Props {}

const BasicInfo: React.FC<Props> = memo((props) => {
  return (
    <div className={cn(styles.basicInfo)}>
      <span className={cn(styles.title)}>基本信息</span>
    </div>
  )
})

export default BasicInfo
