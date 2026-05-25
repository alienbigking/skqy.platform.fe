import React, { Fragment, useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import cn from 'classnames'
import styles from './registerPassword.less'
import { loginService } from '../services'
import { loginNameValidator } from '@/utils'
import { RuleObject } from 'rc-field-form/lib/interface'

interface Props {
  onLogin?: () => void
  onForgetPassword?: () => void
}

type FieldType = {
  loginName?: string
  captcha?: string
  invitationCode?: string
  password?: string
  confirmPassword?: string
  nickname?: string
  remark?: string
}

const RegisterPassword: React.FC<Props> = (props) => {
  const {} = props
  const [form] = Form.useForm()
  const [isShowCountdownText, setIsShowCountdownText] = useState<number | null>(
    null
  )
  const [isDisable, setIsDisable] = useState(false)

  let timeoutTimer: any, intervalTimer: any

  useEffect(() => {
    // getLocation()
  }, [])

  const onFinish = async (values: any) => {
    console.log('表单内容', values)

    try {
      // 获取用户位置信息
      // const locationInfo = await getLocation()
      // console.log('位置信息', locationInfo)

      // 构建完整的注册数据
      const registrationData = {
        ...values,
        // location: locationInfo,
        registerTime: new Date().toISOString()
      }

      console.log('完整注册数据', registrationData)

      const data = await loginService.register(registrationData)
      console.log('注册结果', data)

      if (data?.status === 0) {
        message.success(data.message)
        onLogin()
      } else {
        message.warning(data.message)
      }
    } catch (error) {
      // 位置信息获取失败时，仍然允许注册（可选）
      const data = await loginService.register({
        ...values,
        registerTime: new Date().toISOString()
      })

      if (data?.status === 0) {
        message.success(data.message)
        onLogin()
      } else {
        message.warning(data.message)
      }
    }
  }
  const onFinishFailed = () => {
    console.log('表单校验了')
  }

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

  const validateConfirmPassword = (rule: RuleObject, value: string) => {
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
    <Fragment>
      <div className={cn(styles.registerPassword)}>
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
            <Form.Item<FieldType>
              name="invitationCode"
              rules={[{ required: false, message: '请输入机构邀请码' }]}
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
              返回登录
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default RegisterPassword
