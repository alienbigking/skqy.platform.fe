import React, { Fragment, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { history } from '@umijs/max'
import cn from 'classnames'
import styles from './loginPassword.less'
import { loginService } from '@/pages/login/services'
import { env } from '@/config/env'
import { loginNameValidator, storage } from '@/utils'
import { SliderCaptcha } from '@/components/sliderCaptcha'

interface Props {
  onRegister?: () => void
  onForgetPassword?: () => void
}

type FieldType = {
  loginName?: string
  captcha?: string
  password?: string
  remember?: string
}

const LoginPassword: React.FC<Props> = (props) => {
  const {} = props
  const [form] = Form.useForm()
  const [isShowCountdownText, setIsShowCountdownText] = useState<number | null>(
    null
  )
  const [isDisable, setIsDisable] = useState(false)

  const [isSliderSuccess, setIsSliderSuccess] = useState(false)

  let timeoutTimer: any, intervalTimer: any
  const onFinish = async (values: any) => {
    if (!isSliderSuccess) {
      message.error('请先通过滑块验证')
      return
    }
    try {
      const data = await loginService.login({
        clientId: env.OAUTH_CLIENT_ID,
        clientSecret: env.OAUTH_CLIENT_SECRET,
        userIdentifier: values.loginName,
        credential: values.password,
        identityType: 'password'
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
  const handleSliderSuccess = () => {
    message.success('验证成功')
    setIsSliderSuccess(true)
  }

  const handleSliderFail = () => {
    message.error('验证失败')
    setIsSliderSuccess(false)
  }

  const handleSliderReset = () => {
    setIsSliderSuccess(false)
  }

  return (
    <Fragment>
      <div className={cn(styles.loginPassword)}>
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
                  name="password"
                  noStyle
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>
              </div>
            </Form.Item>

            {/*<Form.Item<FieldType> noStyle valuePropName="checked">*/}
            {/*  <Checkbox>记住密码</Checkbox>*/}
            {/*</Form.Item>*/}

            <div className={cn(styles.slider)}>
              <SliderCaptcha
                onSuccess={handleSliderSuccess}
                onFail={handleSliderFail}
                onReset={handleSliderReset}
              />
            </div>

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

export default LoginPassword
