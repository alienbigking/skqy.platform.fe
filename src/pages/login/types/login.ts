interface IRegisterParams {
  captcha: string
  loginName: string
  invitationCode?: string
  remark: string
  nickname: string
}

interface ILoginParams {
  captcha: string
  loginName: string
}

interface ISendCaptchaParams {
  loginName: string
}

interface IResetPasswordParams {
  loginName: string
  captcha: string
  password: string
  confirmPassword: string
}

interface ILocationInfo {
  province: string
  provinceAdcode: string
  city: string
  cityAdcode: string
  cityCenter: { longitude: number; latitude: number } | null
  district: string
  districtAdcode: string
  districtCenter: { longitude: number; latitude: number } | null
  address: string
  userLocation: {
    longitude: number
    latitude: number
    coordinateSystem: string
  }
  registerSource: string
}

export {
  IRegisterParams,
  ILoginParams,
  ISendCaptchaParams,
  IResetPasswordParams,
  ILocationInfo
}
