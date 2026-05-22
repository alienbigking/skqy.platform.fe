import React, { useState } from 'react'
import cn from 'classnames'
import styles from './login.less'
import loginBoxBackground from '@/assets/images/loginBoxBackground.png'
import loginLeft from '@/assets/images/loginLeft.png'
import beian from '@/assets/images/beian.png'

import ForgetPassword from './forgetPassword'
import LoginPassword from '@/pages/login/components/loginPassword'
import { Tabs } from 'antd'
import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import LoginAction from '@/pages/login/components/loginAction'
import { ELoginType } from '@/pages/common/types/common'
import RegisterPassword from '@/pages/login/components/registerPassword'

interface Props {}

const Login: React.FC<Props> = (props) => {
  const {} = props
  const [isShowLogin, setIsShowLogin] = useState(true)
  const [isShowForgetPassword, setIsShowForgetPassword] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<ELoginType>(ELoginType.login)
  const [activeTabKey, setActiveTabKey] = useState('0')

  const items = [
    {
      icon: <LockOutlined />,
      title: '账户密码登录'
    },
    {
      icon: <PhoneOutlined />,
      title: '验证码登录'
    }
  ]
  const onRegister = () => {
    setLoginType(ELoginType.register)
  }

  const onLogin = () => {
    console.log('返回登录时获取激活key', activeTabKey)
    setLoginType(ELoginType.login)
  }

  const onForgetPassword = () => {
    setLoginType(ELoginType.forgetPassword)
  }

  const onActiveTabChange = (activeKey: string) => {
    console.log('激活下标', activeKey)
    setActiveTabKey(activeKey)
  }

  const onCopyRight = () => {
    window.open('https://beian.miit.gov.cn/')
  }

  return (
    <div className={cn(styles.login)}>
      <div className={cn(styles.loginHeader)}>
        {/*<img src={logoBrand} />*/}
        <span className={cn(styles.loginTitle)}>InnoMedi</span>
      </div>
      <div className={cn(styles.loginBox)}>
        <div className={cn(styles.loginMain)}>
          <img src={loginBoxBackground} />

          <div className={cn(styles.center)}>
            <div className={cn(styles.left)}>
              <img src={loginLeft} />
            </div>
            <div className={cn(styles.right)}>
              {loginType === ELoginType.login && (
                <>
                  <div className={cn(styles.title)}>登录</div>
                  <Tabs
                    activeKey={activeTabKey}
                    onChange={onActiveTabChange}
                    items={items.map((item, i) => {
                      return {
                        key: String(i),
                        icon: item.icon,
                        label: item.title,
                        children:
                          i === 0 ? (
                            <LoginPassword
                              onRegister={onRegister}
                              onForgetPassword={onForgetPassword}
                            />
                          ) : (
                            <LoginAction
                              onRegister={onRegister}
                              onForgetPassword={onForgetPassword}
                            />
                          )
                      }
                    })}
                  />
                </>
              )}

              {loginType === ELoginType.register && (
                <RegisterPassword
                  onLogin={onLogin}
                  onForgetPassword={onForgetPassword}
                />
              )}

              {loginType === ELoginType.forgetPassword && (
                <ForgetPassword onRegister={onRegister} onLogin={onLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles.loginFooter)}>
        <div className={cn(styles.copyright)} onClick={() => onCopyRight()}>
          <img src={beian} />
          <span className={cn(styles.copyrightText)}>粤ICP备2021109239号</span>
        </div>
      </div>
    </div>
  )
}

export default Login
