import { RuleObject, StoreValue } from 'rc-field-form/lib/interface'

const loginNameValidator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void
) => {
  const phoneRegex = /^(\+86)?1[3-9]\d{9}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/
  if (value) {
    if (
      phoneRegex.test(value) ||
      emailRegex.test(value) ||
      usernameRegex.test(value)
    ) {
      return Promise.resolve()
    } else {
      return Promise.reject(
        '请输入手机号、邮箱或 3-20 位用户名（字母、数字、下划线、点号）'
      )
    }
  } else {
    return Promise.resolve()
  }
}
const phoneNumberValidator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void
) => {
  let regex =
    /^(13\d|14[5-9]|15[0-35-9]|16[25-7]|17[0-8]|18\d|19[0-25-9])\d{8}$/gi
  console.log('手机号码校验的内容', value)
  if (value) {
    if (regex.test(value)) {
      console.log('手机号码校验通过了')
      return Promise.resolve()
    } else {
      console.log('手机号码校验失败了')
      return Promise.reject('手机号码校验失败，请检查是否正确')
    }
  } else {
    return Promise.resolve()
  }
}

export { phoneNumberValidator, loginNameValidator }
