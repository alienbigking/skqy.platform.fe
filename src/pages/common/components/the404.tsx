import React from 'react'
import styles from './the404.less'
import cn from 'classnames'
import { FrownFilled, RollbackOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { history } from '@@/core/history'

interface Props {}

const The404: React.FC<Props> = (props) => {
  const onBack = () => {
    history.back()
  }
  const onBackLogin = () => {
    history.push('/login')
  }

  return (
    <div className={cn(styles.the404)}>
      <div className={cn(styles.content)}>
        <div className={cn(styles.left)}>
          <FrownFilled />
        </div>
        <div className={cn(styles.right)}>
          <div className={cn(styles.code)}>404</div>
          <div className={cn(styles.info)}>
            页面内容不存在或丢失，请返回或重新登录。
          </div>
          <div className={cn(styles.actions)}>
            <Button
              icon={<RollbackOutlined />}
              size="large"
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={onBack}
            >
              返回
            </Button>
            <Button
              icon={<RollbackOutlined />}
              size="large"
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={onBackLogin}
            >
              返回登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default The404
