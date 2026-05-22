import React, { Fragment, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { history } from '@umijs/max'
import cn from 'classnames'
import styles from './loginPassword.less'
import { loginService } from '@/pages/login/services'
import { loginNameValidator, storage } from '@/utils'
import { commonService } from '@/pages/common/services'
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
    console.log('表单信息', values)
    if (!isSliderSuccess) {
      message.error('请先通过滑块验证')
      return
    }
    const data = await loginService.login(values)
    if (data.code === '200') {
      storage.setSession('token', data.data.token)

      commonService.getUserInfo().then((res) => {
        console.log('用户信息', res)
        const { code, data } = res
        storage.setSession('userInfo', data)
        commonService
          .getAllPermission()
          .then((res) => {
            console.log('获取的用户权限', res.data)
            if (res.code === '200') {
              storage.setSession('permissions', res.data)
              message.success('登录成功')
              history.push('/workbench')
            }
          })
          .catch((e) => {
            message.warning('获取用户权限失败')
          })
      })
    } else {
      message.warning(data.msg)

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
                { required: true, message: '请输入手机号/邮箱' },
                {
                  validator: loginNameValidator
                }
              ]}
            >
              <Input placeholder="请输入手机号/邮箱" />
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
