import http from './http'
import * as emitter from './event'
import {
  filterHeartRateTrendData,
  getMaxAndMinData,
  getMedian
} from './chartDataFilter'
import {
  browserType,
  calculateAge,
  chineseTime,
  dataURLToBlob,
  formatNumberWithCommas,
  formatPrice,
  gender,
  generateRandomHashString,
  isNullObject,
  parseClient,
  parseUrlToFileInfo,
  removeQueryParams,
  timeCeil,
  wearTime
} from './general'
import { getUrlParams } from './urlParams'
import { loginNameValidator, phoneNumberValidator } from './validator'
import { hasPermission } from './permission'
import storage from './storage'
import {
  accountOptions,
  analysisStateOptions,
  deviceTypeOptions,
  genderOptions,
  healthReportTypeOptions,
  inspectionResultOptions,
  interpretationStatusOptions,
  pageTypeOptions,
  pdfNumberOptions,
  positiveLevelResultOptions,
  productTypeOptions,
  reportTypeOptions,
  sourceProviderOptions,
  symptomLabelOptions,
  uploadNoticeOptions
} from './options'
import {
  filterAccountStatus,
  filterAnalysisState,
  filterChannelStatus,
  filterDeviceType,
  filterEShelfStatus,
  filterEventsType,
  filterHealthReportType,
  filterInspectionResult,
  filterInterpretationStatus,
  filterPageType,
  filterPdfNumberType,
  filterPositiveLevelResult,
  filterProductType,
  filterSubmissionStatus
} from './filters'
import { base64ToBinary, hex2Short } from './dataConVersion'
import { createPlaceholderItem } from './dataTemplates'

export {
  http,
  getMaxAndMinData,
  getMedian,
  gender,
  chineseTime,
  wearTime,
  getUrlParams,
  timeCeil,
  isNullObject,
  dataURLToBlob,
  formatNumberWithCommas,
  generateRandomHashString,
  emitter,
  phoneNumberValidator,
  loginNameValidator,
  hasPermission,
  storage,
  genderOptions,
  pageTypeOptions,
  accountOptions,
  uploadNoticeOptions,
  healthReportTypeOptions,
  analysisStateOptions,
  inspectionResultOptions,
  positiveLevelResultOptions,
  reportTypeOptions,
  deviceTypeOptions,
  symptomLabelOptions,
  productTypeOptions,
  sourceProviderOptions,
  interpretationStatusOptions,
  pdfNumberOptions,
  filterHeartRateTrendData,
  filterAnalysisState,
  filterInspectionResult,
  filterPositiveLevelResult,
  filterAccountStatus,
  filterHealthReportType,
  filterPageType,
  filterChannelStatus,
  filterDeviceType,
  filterEventsType,
  filterProductType,
  filterEShelfStatus,
  filterSubmissionStatus,
  filterInterpretationStatus,
  filterPdfNumberType,
  calculateAge,
  base64ToBinary,
  hex2Short,
  formatPrice,
  parseUrlToFileInfo,
  removeQueryParams,
  createPlaceholderItem,
  browserType,
  parseClient
}
