import React, { useState } from 'react'
import { DoubleLeftOutlined, LeftOutlined } from '@ant-design/icons'
import cn from 'classnames'
import styles from './arrowText.less'

import { EArrowTextType } from '../types/arrowText'

interface Props {
  text: string
  type?: EArrowTextType
  onExpand?: (value: boolean) => void
}

const ArrowText: React.FC<Props> = (props) => {
  const { text = '123', type = EArrowTextType.singleArrow, onExpand } = props
  const [rotate, setRotate] = useState(0)
  const onClick = () => {
    let result = rotate === 0 ? -90 : 0
    setRotate(result)
    onExpand!(result === -90) // true展开
    console.log('触发了')
  }

  return (
    <span className={cn(styles.arrowText)} onClick={onClick}>
      {text}
      {type === EArrowTextType.singleArrow ? (
        <LeftOutlined rotate={rotate} className={cn(styles.singleArrow)} />
      ) : (
        <DoubleLeftOutlined
          rotate={rotate}
          className={cn(styles.doubleArrow)}
        />
      )}
    </span>
  )
}

export default ArrowText
