import React, { Fragment, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { history } from '@umijs/max'
import cn from 'classnames'
import styles from './loginAction.less'
import { loginService } from '@/pages/login/services'
import { loginNameValidator, storage } from '@/utils'
import { env } from '@/config/env'

interface Props {
  onRegister?: () => void
  onForgetPassword?: () => void
}

type FieldType = {
  loginName?: string
  captcha?: string
  remember?: string
}

const LoginAction: React.FC<Props> = (props) => {
  const {} = props
  const [form] = Form.useForm()
  const [isShowCountdownText, setIsShowCountdownText] = useState<number | null>(
    null
  )
  const [isDisable, setIsDisable] = useState(false)

  let timeoutTimer: any, intervalTimer: any
  const onFinish = async (values: any) => {
    try {
      const data = await loginService.login({
        clientId: env.OAUTH_CLIENT_ID,
        clientSecret: env.OAUTH_CLIENT_SECRET,
        userIdentifier: values.loginName,
        credential: values.captcha,
        identityType: 'code'
      })
      if (data.status === 0) {
        const authData = data.data
        storage.setSession('token', authData.accessToken)
        storage.setSession('userInfo', authData.user || {})
        storage.setSession('permissions', authData.permissions || [])
        message.success('登录成功')
        history.push('/workbench')
      } else {
        message.warning(data.message || '登录失败')
      }
    } catch (error: any) {
      message.warning(error?.response?.data?.message || '登录失败')
    } finally {
      setIsDisable(false)
    }
  }
  const onFinishFailed = () => {
    // history.push('/home')
  }

  const onRegister = () => {
    if (props.onRegister) {
      props.onRegister()
    }
  }

  const onForgetPassword = () => {
    if (props.onForgetPassword) {
      props.onForgetPassword()
    }
  }

  const onSendCaptchaCode = async () => {
    const values = form.getFieldsValue()
    if (!values.loginName) {
      return message.warning('请先输入登录名')
    }

    setIsDisable(true)

    try {
      const data = await loginService.sendCaptcha({
        loginName: values.loginName
      })
      console.log('获取的验证码', data)

      if (data.status === 0) {
        message.success(data.message)
        handleCountdown()
      } else {
        message.warning(data.message)

        setIsDisable(false)
      }
    } catch (e) {
      message.warning('请求异常，请重试！')

      setIsDisable(false)
    }
  }

  const handleCountdown = () => {
    let number = 60

    intervalTimer = setInterval(() => {
      --number
      setIsShowCountdownText(number)
      if (number === 0) {
        clearInterval(intervalTimer)
        setIsDisable(false)
      }
    }, 1000)
  }

  return (
    <Fragment>
      <div className={cn(styles.loginAction)}>
        {/*<div className={cn(styles.title)}>登录</div>*/}
        <div className={cn(styles.main)}>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="loginName"
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请输入手机号、邮箱或用户名' },
                {
                  validator: loginNameValidator
                }
              ]}
            >
              <Input placeholder="请输入手机号、邮箱或用户名" />
            </Form.Item>

            <Form.Item<FieldType>>
              <div className={cn(styles.verification)}>
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input type="number" placeholder="请输入验证码" />
                </Form.Item>
                <Button
                  type="primary"
                  className={cn(styles.verificationBtn)}
                  onClick={onSendCaptchaCode}
                  disabled={isDisable}
                >
                  {isShowCountdownText ? isShowCountdownText : '获取验证码'}
                </Button>
              </div>
            </Form.Item>

            {/*<Form.Item<FieldType> noStyle valuePropName="checked">*/}
            {/*  <Checkbox>记住密码</Checkbox>*/}
            {/*</Form.Item>*/}

            <div className={cn(styles.btns)}>
              <Button
                type="primary"
                htmlType="submit"
                className={cn(styles.loginBtn)}
              >
                登录
              </Button>
            </div>
          </Form>
          <div className={cn(styles.actions)}>
            <div className={cn(styles.registerBtn)} onClick={onRegister}>
              立即注册
            </div>
            <div className={cn(styles.line)}></div>
            <div
              className={cn(styles.forgetPassword)}
              onClick={onForgetPassword}
            >
              忘记密码
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default LoginAction
