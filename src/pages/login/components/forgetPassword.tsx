import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import cn from 'classnames'
import styles from './forgetPassword.less'
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface'
import { loginNameValidator } from '@/utils'
import { loginService } from '@/pages/login/services'

interface Props {
  onRegister?: () => void
  onLogin?: () => void
}

type FieldType = {
  loginName?: string
  password?: string
  confirmPassword?: string
  remember?: string
}

const ForgetPassword: React.FC<Props> = (props) => {
  const {} = props
  const [form] = Form.useForm()
  const [isShowCountdownText, setIsShowCountdownText] = useState<number | null>(
    null
  )
  const [isDisable, setIsDisable] = useState(false)

  let timeoutTimer: any, intervalTimer: any

  const onFinish = async (values: any) => {
    console.log('表单内容', values)
    const data = await loginService.resetPassword({
      ...values
    })
    console.log('重置密码结果', data)
    if (data?.status === 0) {
      message.success(data.message)
      onLogin()
    } else {
      message.warning(data.message)
    }
  }
  const onFinishFailed = () => {}

  const onRegister = () => {
    if (props.onRegister) {
      props.onRegister()
    }
  }

  const onLogin = () => {
    if (props.onLogin) {
      props.onLogin()
    }
  }

  const onSendCaptchaCode = async () => {
    const values = form.getFieldsValue()
    console.log('获取的表单对象', values)
    if (!values.loginName) {
      return message.warning('请先输入手机号/邮箱')
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

  const validatePassword = (rule: RuleObject, value: string) => {
    console.log('校验了', value, form.getFieldValue('confirmPassword'))

    // 校验密码规则：至少8位，不能有空格，包含至少一个小写字母、一个大写字母、一个数字和一个特殊字符
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?!.*\s).{8,}$/

    if (!regex.test(value)) {
      return Promise.reject(
        '密码至少8位，且必须包含至少一个小写字母、一个大写字母、一个数字和一个特殊字符（@, $, !, %, *, ?, &），且不能包含空格'
      )
    }

    // 校验密码与确认密码是否一致
    if (value && value !== form.getFieldValue('confirmPassword')) {
      return Promise.reject('与确认密码不一致!')
    }

    return Promise.resolve()
  }

  const validateConfirmPassword = (rule: RuleObject, value: StoreValue) => {
    if (value && value !== form.getFieldValue('password')) {
      return Promise.reject('与输入密码不一致!')
    }
    return Promise.resolve()
  }

  const onPasswordChange = (e: { target: { value: any } }) => {
    form.validateFields(['confirmPassword'])
  }

  const onConfirmPasswordChange = (e: { target: { value: any } }) => {
    form.validateFields(['password'])
  }

  return (
    <div className={cn(styles.forgetPassword)}>
      <div className={cn(styles.title)}>忘记密码</div>
      <div className={cn(styles.main)}>
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
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
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { validator: validatePassword }
            ]}
          >
            <Input.Password
              type="password"
              placeholder="请输入密码"
              onBlur={onPasswordChange}
            />
          </Form.Item>
          <Form.Item<FieldType>
            name="confirmPassword"
            rules={[
              { required: true, message: '请再次确认密码' },
              { validator: validateConfirmPassword }
            ]}
          >
            <Input.Password
              placeholder="请再次确认密码"
              onBlur={onConfirmPasswordChange}
            />
          </Form.Item>

          <Form.Item className={cn(styles.btns)}>
            <Button
              type="primary"
              htmlType="submit"
              className={cn(styles.confirmBtn)}
            >
              确定
            </Button>
          </Form.Item>
        </Form>
        <div className={cn(styles.actions)}>
          <div className={cn(styles.registerBtn)} onClick={onRegister}>
            去注册
          </div>
          <div className={cn(styles.line)}></div>
          <div className={cn(styles.forgetPassword)} onClick={onLogin}>
            去登录
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
