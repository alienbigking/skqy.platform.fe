import React, { ReactElement } from 'react'
import { Row } from 'antd'
import styles from './theContent.less'
import { string } from 'prop-types'
interface Props {
  children: ReactElement
}
const TheContent: React.FC<Props> = (props) => {
  return (
    <div className={styles.theContent}>
      {/*<div>内容</div>*/}
      {props.children}
    </div>
  )
}

export default TheContent
