import React from 'react'
import styles from './theFooter.less'
import cn from 'classnames'
interface Props {}
const TheFooter: React.FC<Props> = (props) => {
  return (
    <div className={cn(styles.theFooter)}>
      <div>底部信息</div>
    </div>
  )
}

export default TheFooter
