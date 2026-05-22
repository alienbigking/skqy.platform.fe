import React, { ReactNode } from 'react'
import { Button, ButtonProps } from 'antd'
import cn from 'classnames'
import styles from './advancedButton.less'
import { PlusOutlined } from '@ant-design/icons'
import { EType } from '../types/advancedButton'
import { ButtonType } from 'antd/es/button/buttonHelpers'

interface Props {
  type?: EType
  title: string
  customClassName?: string
  defaultProps?: ButtonProps
}

const AdvancedButton: React.FC<Props> = (props) => {
  const { type, title, customClassName, defaultProps } = props

  const handleIcons = (): ReactNode => {
    if (!type) {
      return
    }

    if (type === EType.new) {
      return <PlusOutlined />
    } else {
      return false
    }
  }

  const handleType = (): ButtonType => {
    if (!type) {
      return 'default'
    }

    if (type === EType.new) {
      return 'primary'
    } else if (type === EType.generalText) {
      return 'text'
    } else if (type === EType.delete) {
      return 'text'
    } else {
      return 'primary'
    }
  }

  return (
    <Button
      type={handleType()}
      className={cn([
        type === EType.new ? styles.newButton : '',
        type === EType.general ? styles.generalButton : '',
        type === EType.generalText ? styles.generalTextButton : '',
        type === EType.delete ? styles.deleteButton : '',
        customClassName
      ])}
      icon={handleIcons()}
      {...defaultProps}
    >
      {title}
    </Button>
  )
}

export default AdvancedButton
