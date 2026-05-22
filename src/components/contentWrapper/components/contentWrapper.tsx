import React, { ReactNode } from 'react'
import cn from 'classnames'
import styles from './contentWrapper.less'

// import { xxx } from '../types/demo'

interface Props {
  children: ReactNode
}

const ContentWrapper: React.FC<Props> = (props) => {
  const { children } = props
  return <div className={cn(styles.contentWrapper)}>{children}</div>
}

export default ContentWrapper
