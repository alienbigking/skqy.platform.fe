import React, { memo, useEffect } from 'react'
import { Form, Input, message, Modal } from 'antd'
import cn from 'classnames'
import styles from './theEditPassword.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface'
import { commonService } from '@/pages/common/services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  oldPassword?: string
  password?: string
  confirmPassword?: string
}
const TheEditPassword: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
    }
  }, [isVisible])

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    const data = await commonService.updatePassword({ ...values })

    if (data.code === '200') {
      message.success('更新密码成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
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
    <div className={cn(styles.theEditPassword)}>
      <Modal
        title="修改密码"
        open={isVisible}
        width={568}
        centered
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <AdvancedButton
            key="cancel"
            title="取消"
            defaultProps={{
              onClick: onCancel
            }}
          />,
          <AdvancedButton
            key="confirm"
            type={EType.general}
            title="确认"
            defaultProps={{
              onClick: onOk
            }}
          />
        ]}
      >
        <Form
          form={form}
          name="form"
          autoComplete="off"
          colon={false}
          labelAlign="right"
          labelCol={{ span: 4 }}
        >
          <Form.Item<FieldType>
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password
              type="password"
              placeholder="请输入原密码"
              onBlur={onPasswordChange}
            />
          </Form.Item>
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: '请输入新密码' },
              { validator: validatePassword }
            ]}
          >
            <Input.Password
              type="password"
              placeholder="请输入新密码"
              onBlur={onPasswordChange}
            />
          </Form.Item>
          <Form.Item<FieldType>
            name="confirmPassword"
            rules={[
              { required: true, message: '请再次确认新密码' },
              { validator: validateConfirmPassword }
            ]}
          >
            <Input.Password
              placeholder="请再次确认新密码"
              onBlur={onConfirmPasswordChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})

export default TheEditPassword
