import React from 'react'
import styles from './the403.less'
import cn from 'classnames'
import { Button } from 'antd'
import { history } from '@umijs/max'
import { RollbackOutlined, WarningFilled } from '@ant-design/icons'

interface Props {}

const The403: React.FC<Props> = (props) => {
  const onBack = () => {
    history.push('/login')
  }

  return (
    <div className={cn(styles.the403)}>
      <div className={cn(styles.content)}>
        <div className={cn(styles.left)}>
          <WarningFilled />
        </div>
        <div className={cn(styles.right)}>
          <div className={cn(styles.code)}>登录超时</div>
          <div className={cn(styles.info)}>
            暂无权限或token过期，请重新登录。
          </div>
          <div className={cn(styles.actions)}>
            <Button
              icon={<RollbackOutlined />}
              size="large"
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={onBack}
            >
              返回登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default The403
