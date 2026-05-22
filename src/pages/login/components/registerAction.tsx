import React, { Fragment, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import cn from 'classnames'
import styles from './registerAction.less'
import { loginService } from '../services'
import { loginNameValidator } from '@/utils'

interface Props {
  onLogin?: () => void
  onForgetPassword?: () => void
}

type FieldType = {
  loginName?: string
  captcha?: string
  invitationCode?: string
  password?: string
  nickname?: string
  remark?: string
}

const RegisterAction: React.FC<Props> = (props) => {
  const {} = props
  const [form] = Form.useForm()
  const [isShowCountdownText, setIsShowCountdownText] = useState<number | null>(
    null
  )
  const [isDisable, setIsDisable] = useState(false)

  let timeoutTimer: any, intervalTimer: any

  const onFinish = async (values: any) => {
    console.log('表单内容', values)
    const data = await loginService.register({
      ...values
    })
    console.log('注册结果', data)
    if (data?.code === '200') {
      message.success(data.msg)
      onLogin()
    } else {
      message.warning(data.msg)
    }
  }
  const onFinishFailed = () => {}

  const onLogin = () => {
    if (props.onLogin) {
      props.onLogin()
    }
  }

  const onForgetPassword = () => {
    if (props.onForgetPassword) {
      props.onForgetPassword()
    }
  }

  const onSendCaptchaCode = async () => {
    const values = form.getFieldsValue()
    console.log('获取的表单对象', values)
    if (!values.loginName) {
      return message.warning('请先输入登录名')
    }

    setIsDisable(true)

    try {
      const data = await loginService.sendCaptcha({
        loginName: values.loginName
      })
      console.log('获取的验证码', data)
      if (data.code === '200') {
        message.success(data.msg)
        handleCountdown()
      } else {
        message.warning(data.msg)
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
      <div className={cn(styles.registerAction)}>
        <div className={cn(styles.title)}>注册</div>
        <div className={cn(styles.main)}>
          <Form
            form={form}
            name="register"
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
            <Form.Item<FieldType>
              name="invitationCode"
              rules={[{ required: true, message: '请输入机构邀请码' }]}
            >
              <Input placeholder="请输入机构邀请码" />
            </Form.Item>
            <Form.Item<FieldType>
              name="nickname"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item<FieldType>>
              <div className={cn(styles.remark)}>
                <Form.Item
                  name="remark"
                  noStyle
                  rules={[{ required: true, message: '请输入备注' }]}
                >
                  <Input placeholder="请输入备注" />
                </Form.Item>
                <div className={cn(styles.remarkText)}>
                  请输入详细信息，更快速注册审核通过
                </div>
              </div>
            </Form.Item>
            <Form.Item className={cn(styles.btns)}>
              <Button
                type="primary"
                htmlType="submit"
                className={cn(styles.registerBtn)}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
          <div className={cn(styles.actions)}>
            <div className={cn(styles.loginBtn)} onClick={onLogin}>
              登录
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default RegisterAction
