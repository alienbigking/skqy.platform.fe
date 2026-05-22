import * as React from 'react'

enum ELoginType {
  login = 0,
  register = 1,
  forgetPassword = 2
}

enum EAccountStatus {
  audit = 0,
  approve = 1,
  disabled = 2
}

enum EHealthReportType {
  long = 0,
  short = 1
}

enum EPageType {
  menu = 0,
  permission = 1
}

enum EFormatAnalysisState {
  wear = 0, // 佩戴中
  preAnalysis = 1, // 预分析
  analyzed = 2, // 分析中
  analysisPhase = 3,
  analysisCompletion = 4, // 分析完成
  anslysisFail = 5, // 分析失败
  pendingAnalysisCompletion = 6 // 待分析完成
}

enum EInspectionResult {
  unknown = 0,
  negative = 1,
  abnormal = 2
}

enum EPositiveLevelResult {
  null = 0,
  mild = 1,
  moderate = 2,
  severe = 3
}

enum EChannelStatus {
  notSubmitted = 0,
  submitted = 1
}

enum EDeviceType {
  device1 = 1,
  device2 = 2,
  device3 = 3,
  device4 = 4,
  device5 = 5
}

enum EEvents {
  SR,
  AB,
  AFIB,
  ATL,
  AT,
  VB,
  BII,
  BIII,
  IVR,
  NOD,
  J,
  P,
  PM,
  PREX,
  SBR,
  SVTA,
  T,
  VF,
  VFIB,
  VFL,
  VT,
  AYSY,
  HGEA,
  VER,
  N,
  AF,
  O,
  ARTIFACT,
  TA,
  BR,
  VPREB,
  SVPREB
}

enum EImuStatus {
  stationary = 0,
  walking = 1,
  jogging = 4,
  biking = 8,
  driving = 12
}

enum EProductType {
  report = 'report', // PDF报告
  interpretation = 'interpretation' // 解读服务
}

enum EUrgencyType {
  standard = 'standard', // 正常
  express = 'express' // 加急
}

enum EShelfStatus {
  unlisted = 1, // 未上架
  listed = 2 // 已上架
}

enum ESubmissionStatus {
  unsubmitted = 0, // 未提交
  submitted = 1, // 提交中
  completed = 2, // 解读完成
  submitFailure = 3 // 提交失败
}

enum EInterpretationStatus {
  interpreted = 1, // 解读完成
  interpretationFailure = 2 // 解读失败
}

enum EPdfNumberType {
  increase = 'increase', // 新增PDF报告数量
  decrease = 'decrease' // 减少PDF报告数量
}

enum EDataStatisticsReportType {
  healthReport = 1, // 健康报告
  dynamicReport = 2,
  aiReport = 3
}

enum EPlatformSourceType {
  rzcMiniProgram = 1,
  zysxMiniProgram = 2,
  platform = 6
}

interface IAnyKey {
  [key: string]: any
}

type TActionOptions = Array<{
  label: string | React.ReactNode
  value: string | number
}>

interface IPagination {
  pageSize?: number
  pageNum?: number
  sort?: {
    field?: string
    order?: 'asc' | 'desc'
  }
}

interface IUploadsParams {
  file: any
}

interface IAliyunUploadParams {
  url: string
  file: File
}

interface IUploadUrlParams {
  originalName: string
}

interface IDoctorListParams {
  username: string
}

interface IUserInfoParams {
  active: number
  createAt: string
  email: string
  gender: number
  id: string
  mobile: string
  nickname: string
  organizationId: string
  remark: string
  status: number
  username: string
}

interface IConnectWorkbenchParams {
  id: string
}

interface IMenuBarListParams {}

interface IUpdatePasswordParams {}

interface ILoginOutParams {}

interface IUpdateEcgAnalysisStatusParams {
  id: string
  status: number
}

interface IPublicUploadParams {
  originalName: string
}

interface ISetPublicFileParams {
  ossId: string
}

export {
  EAccountStatus,
  EHealthReportType,
  EPageType,
  EFormatAnalysisState,
  EInspectionResult,
  EPositiveLevelResult,
  EChannelStatus,
  EDeviceType,
  EEvents,
  ELoginType,
  EImuStatus,
  EProductType,
  EUrgencyType,
  EShelfStatus,
  ESubmissionStatus,
  EInterpretationStatus,
  EPdfNumberType,
  EDataStatisticsReportType,
  EPlatformSourceType,
  IAnyKey,
  TActionOptions,
  IPagination,
  IUploadsParams,
  IDoctorListParams,
  IConnectWorkbenchParams,
  IMenuBarListParams,
  IUploadUrlParams,
  IAliyunUploadParams,
  IUserInfoParams,
  IUpdatePasswordParams,
  ILoginOutParams,
  IUpdateEcgAnalysisStatusParams,
  IPublicUploadParams,
  ISetPublicFileParams
}
