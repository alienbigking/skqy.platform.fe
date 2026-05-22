import { RuleObject, StoreValue } from 'rc-field-form/lib/interface'

const loginNameValidator = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void
) => {
  let regex =
    /^(\+86)?(13\d|14[5-9]|15[0-35-9]|16[25-7]|17[0-8]|18\d|19[0-25-9])\d{8}$|^([\w-.]+@([\w-]+\.)+[\w-]{2,4})$/gi
  console.log('登录名校验的内容', value)
  if (value) {
    if (regex.test(value)) {
      console.log('登录名校验通过了')
      return Promise.resolve()
    } else {
      console.log('登录名校验失败了')
      return Promise.reject('登录名校验失败，请检查是否正确')
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
