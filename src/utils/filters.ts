import {
  EAccountStatus,
  EChannelStatus,
  EDataStatisticsReportType,
  EDeviceType,
  EEvents,
  EFormatAnalysisState,
  EHealthReportType,
  EImuStatus,
  EInspectionResult,
  EInterpretationStatus,
  EPageType,
  EPdfNumberType,
  EPlatformSourceType,
  EPositiveLevelResult,
  EProductType,
  EShelfStatus,
  ESubmissionStatus,
  EUrgencyType
} from '@/pages/common/types/common'
import {
  accountOptions,
  analysisStateOptions,
  dataStatisticsReportTypeOptions,
  deviceTypeOptions,
  eventsOptions,
  healthReportTypeOptions,
  inspectionResultOptions,
  interpretationStatusOptions,
  pageTypeOptions,
  pdfNumberOptions,
  platformSourceOptions,
  positiveLevelResultOptions,
  shelfStatusOptions,
  submissionStatusOptions
} from './options'

const filterAnalysisState = (value: EFormatAnalysisState) => {
  switch (value) {
    case EFormatAnalysisState.wear:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
    case EFormatAnalysisState.preAnalysis:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
    case EFormatAnalysisState.analyzed:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
    case EFormatAnalysisState.analysisPhase:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
    case EFormatAnalysisState.analysisCompletion:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
    case EFormatAnalysisState.anslysisFail:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
    case EFormatAnalysisState.pendingAnalysisCompletion:
      return analysisStateOptions.filter((item) => item.value === value)[0]
        .label
  }
}

const filterInspectionResult = (value: EInspectionResult) => {
  switch (value) {
    case EInspectionResult.unknown:
      return inspectionResultOptions.filter((item) => item.value === value)[0]
        .label
    case EInspectionResult.negative:
      return inspectionResultOptions.filter((item) => item.value === value)[0]
        .label
    case EInspectionResult.abnormal:
      return inspectionResultOptions.filter((item) => item.value === value)[0]
        .label
  }
}

const filterPositiveLevelResult = (value: EPositiveLevelResult) => {
  switch (value) {
    case EPositiveLevelResult.null:
      return positiveLevelResultOptions.filter(
        (item) => item.value === value
      )[0].label
    case EPositiveLevelResult.mild:
      return positiveLevelResultOptions.filter(
        (item) => item.value === value
      )[0].label
    case EPositiveLevelResult.moderate:
      return positiveLevelResultOptions.filter(
        (item) => item.value === value
      )[0].label
    case EPositiveLevelResult.severe:
      return positiveLevelResultOptions.filter(
        (item) => item.value === value
      )[0].label
  }
}

const filterAccountStatus = (value: EAccountStatus) => {
  switch (value) {
    case EAccountStatus.approve:
      return accountOptions.filter((item) => item.value === value)[0].label
    case EAccountStatus.audit:
      return accountOptions.filter((item) => item.value === value)[0].label
    case EAccountStatus.disabled:
      return accountOptions.filter((item) => item.value === value)[0].label
  }
}

const filterHealthReportType = (value: EHealthReportType) => {
  switch (value) {
    case EHealthReportType.long:
      return healthReportTypeOptions.filter((item) => item.value === value)[0]
        .label
    case EHealthReportType.short:
      return healthReportTypeOptions.filter((item) => item.value === value)[0]
        .label
  }
}

const filterPageType = (value: EPageType) => {
  switch (value) {
    case EPageType.menu:
      return pageTypeOptions.filter((item) => item.value === value)[0].label
    case EPageType.permission:
      return pageTypeOptions.filter((item) => item.value === value)[0].label
  }
}
const filterChannelStatus = (value: EChannelStatus) => {
  switch (value) {
    case EChannelStatus.notSubmitted:
      return '未提交'
    case EChannelStatus.submitted:
      return '已提交'
    default:
      return '未知'
  }
}

const filterDeviceType = (value: EDeviceType) => {
  switch (value) {
    case EDeviceType.device1:
      return deviceTypeOptions.filter((item) => item.value === value)[0].label
    case EDeviceType.device2:
      return deviceTypeOptions.filter((item) => item.value === value)[0].label
    case EDeviceType.device3:
      return deviceTypeOptions.filter((item) => item.value === value)[0].label
    case EDeviceType.device4:
      return deviceTypeOptions.filter((item) => item.value === value)[0].label
    case EDeviceType.device5:
      return deviceTypeOptions.filter((item) => item.value === value)[0].label
    default:
      return '未知'
  }
}

const filterEventsType = (value: EEvents) => {
  switch (value) {
    case EEvents.SR:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.AB:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.AFIB:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.ATL:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.AT:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VB:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.BII:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.BIII:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.IVR:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.NOD:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.J:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.P:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.PM:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.PREX:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.SBR:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.SVTA:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.T:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VF:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VFIB:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VFL:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VT:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.AYSY:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.HGEA:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VER:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.N:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.AF:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.O:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.ARTIFACT:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.TA:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.BR:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.VPREB:
      return eventsOptions.filter((item) => item.value === value)[0].label
    case EEvents.SVPREB:
      return eventsOptions.filter((item) => item.value === value)[0].label
    default:
      return '未知'
  }
}

const filterImuState = (value: EImuStatus) => {
  switch (value) {
    case EImuStatus.stationary:
      return '静坐'
    case EImuStatus.walking:
      return '散步'
    case EImuStatus.jogging:
      return '慢跑'
    case EImuStatus.biking:
      return '骑行'
    case EImuStatus.driving:
      return '驾驶'
    default:
      return '未知'
  }
}
const filterProductType = (value: EProductType) => {
  switch (value) {
    case EProductType.report:
      return 'PDF报告'
    case EProductType.interpretation:
      return '解读服务'
    default:
      return '普通商品'
  }
}

const filterUrgencyType = (value: EUrgencyType) => {
  switch (value) {
    case EUrgencyType.standard:
      return '默认'
    case EUrgencyType.express:
      return '加急'
    default:
      return '默认'
  }
}

const filterEShelfStatus = (value: EShelfStatus) => {
  switch (value) {
    case EShelfStatus.unlisted:
      return shelfStatusOptions.filter((item) => item.value === value)[0].label
    case EShelfStatus.listed:
      return shelfStatusOptions.filter((item) => item.value === value)[0].label
    default:
      return '未知'
  }
}

const filterSubmissionStatus = (value: ESubmissionStatus) => {
  switch (value) {
    case ESubmissionStatus.unsubmitted:
      return submissionStatusOptions.filter((item) => item.value === value)[0]
        .label
    case ESubmissionStatus.submitted:
      return submissionStatusOptions.filter((item) => item.value === value)[0]
        .label
    case ESubmissionStatus.completed:
      return submissionStatusOptions.filter((item) => item.value === value)[0]
        .label
    case ESubmissionStatus.submitFailure:
      return submissionStatusOptions.filter((item) => item.value === value)[0]
        .label
    default:
      return '未知'
  }
}
const filterInterpretationStatus = (value: EInterpretationStatus) => {
  switch (value) {
    case EInterpretationStatus.interpreted:
      return interpretationStatusOptions.filter(
        (item) => item.value === value
      )[0].label
    case EInterpretationStatus.interpretationFailure:
      return interpretationStatusOptions.filter(
        (item) => item.value === value
      )[0].label
    default:
      return '未知'
  }
}

const filterPdfNumberType = (value: EPdfNumberType) => {
  switch (value) {
    case EPdfNumberType.increase:
      return pdfNumberOptions.filter((item) => item.value === value)[0].label
    case EPdfNumberType.decrease:
      return pdfNumberOptions.filter((item) => item.value === value)[0].label
    default:
      return '未知'
  }
}

const filterDataStatisticsReportType = (value: EDataStatisticsReportType) => {
  switch (value) {
    case EDataStatisticsReportType.healthReport:
      return dataStatisticsReportTypeOptions.filter(
        (item) => item.value === value
      )[0].label
    case EDataStatisticsReportType.dynamicReport:
      return dataStatisticsReportTypeOptions.filter(
        (item) => item.value === value
      )[0].label
    case EDataStatisticsReportType.aiReport:
      return dataStatisticsReportTypeOptions.filter(
        (item) => item.value === value
      )[0].label
    default:
      return '未知'
  }
}

const filterPlatformSourceType = (value: EPlatformSourceType) => {
  switch (value) {
    case EPlatformSourceType.rzcMiniProgram:
      return platformSourceOptions.filter((item) => item.value === value)[0]
        .label
    case EPlatformSourceType.zysxMiniProgram:
      return platformSourceOptions.filter((item) => item.value === value)[0]
        .label
    case EPlatformSourceType.platform:
      return platformSourceOptions.filter((item) => item.value === value)[0]
        .label
    default:
      return '未知'
  }
}

export {
  filterAnalysisState,
  filterInspectionResult,
  filterPositiveLevelResult,
  filterAccountStatus,
  filterHealthReportType,
  filterPageType,
  filterChannelStatus,
  filterDeviceType,
  filterEventsType,
  filterImuState,
  filterProductType,
  filterUrgencyType,
  filterEShelfStatus,
  filterSubmissionStatus,
  filterInterpretationStatus,
  filterPdfNumberType,
  filterPlatformSourceType
}
