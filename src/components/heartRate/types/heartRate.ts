enum EHeartRateMode {
  realTimeMode = 'realTimeMode',
  previewMode = 'previewMode'
}

enum EHeartRateType {
  thirtySecHeartRate = 'thirtySecHeartRate', // 30s心率图
  tenSecHeartRate = 'tenSecHeartRate', // 10s心率图
  fiveSecHeartRate = 'fiveSecHeartRate' // 5s心率图
}

enum ECustomClassName {
  showHeartRate = 'showHeartRate',
  hideHeartRate = 'hideHeartRate'
}

export { EHeartRateType, ECustomClassName, EHeartRateMode }
