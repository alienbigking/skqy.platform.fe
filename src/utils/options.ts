const genderOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '未知', value: 0 }
]

const pageTypeOptions = [
  { label: '菜单', value: 0 },
  { label: '权限', value: 1 }
]

const accountOptions = [
  { label: '审核中', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核拒绝', value: 2 }
]

const uploadNoticeOptions = [
  { label: '通知', value: 0 },
  { label: '不通知', value: 1 }
]

const healthReportTypeOptions = [
  { label: '长程', value: 0 },
  { label: '短程', value: 1 }
]

const analysisStateOptions = [
  { label: '佩戴中', value: 0 },
  { label: '预分析', value: 1 },
  { label: '预分析完成', value: 2 },
  { label: '分析中', value: 3 },
  { label: '分析完成', value: 4 },
  { label: '预分析失败', value: 5 },
  { label: '待分析', value: 6 }
]

const inspectionResultOptions = [
  { label: '未知', value: 0 },
  { label: '阴性', value: 1 },
  { label: '阳性', value: 2 }
]
const positiveLevelResultOptions = [
  { label: '阴性', value: 0 },
  { label: '轻度', value: 1 },
  { label: '中度', value: 2 },
  { label: '重度', value: 3 }
]

const reportTypeOptions = [
  { label: '动态报告', value: 0 },
  { label: '健康报告', value: 1 },
  { label: '合并报告', value: 2 }
]

const deviceTypeOptions = [
  { label: '一代设备-1A', value: 1 },
  { label: '二代设备-2A', value: 2 },
  { label: '三代设备-3A', value: 3 },
  { label: '4G网关', value: 4 },
  { label: '二代设备-2B', value: 5 }
]

const snCodeModeOptions = [
  { label: '单个录入', value: 1 },
  { label: '批量生成', value: 2 }
]

const eventsOptions = [
  { label: '窦性心律', value: 0 },
  { label: '房性二联律', value: 1 },
  { label: '房颤', value: 2 },
  { label: '房扑', value: 3 },
  { label: '房性心动过速', value: 4 },
  { label: '室性二联律', value: 5 },
  { label: '2°心脏传导阻滞', value: 6 },
  { label: '3°心脏传导阻滞', value: 7 },
  { label: '心室自主心律', value: 8 },
  { label: 'A-V交界节律', value: 9 },
  { label: 'A-V交界节律', value: 10 },
  { label: '起搏心律', value: 11 },
  { label: '起搏心律', value: 12 },
  { label: '预激综合征', value: 13 },
  { label: '窦性心动过缓', value: 14 },
  { label: '室上性心动过速', value: 15 },
  { label: '室性三联律', value: 16 },
  { label: '室颤', value: 17 },
  { label: '室颤', value: 18 },
  { label: '室颤', value: 19 },
  { label: '室性心动过速', value: 20 },
  { label: '停搏', value: 21 },
  { label: '高级别心室异位活动', value: 22 },
  { label: '室性逸搏心律', value: 23 },
  { label: 'Normal', value: 24 },
  { label: 'AF', value: 25 },
  { label: 'Other', value: 26 },
  { label: '伪影', value: 27 },
  { label: '心动过速', value: 28 },
  { label: '心动过缓', value: 29 },
  { label: '室性早搏', value: 30 },
  { label: '室上性早搏', value: 31 }
]

const symptomLabelOptions = [
  // { label: '全部', value: 0 },
  { label: '室性早搏', value: 30 },
  { label: '室速', value: 20 },
  { label: '室上性早搏', value: 31 },
  { label: '房颤', value: 2 },
  { label: '心动过速', value: 28 },
  { label: '心动过缓', value: 29 },
  { label: '停搏', value: 21 }
]

const giVenReportTypeOptions = [
  { label: 'AI报告', value: 1 },
  { label: '动态报告', value: 2 }
]

const shelfStatusOptions = [
  { label: '未上架', value: 1 },
  { label: '已上架', value: 2 }
]

const productTypeOptions = [
  { label: '报告', value: 'report' },
  { label: '解读', value: 'interpretation' },
  { label: '设备主机', value: 'device' },
  { label: '耗材', value: 'consumables' },
  { label: '配件', value: 'accessories' }
]

const sourceProviderOptions = [
  { label: '乐心（健康报告）', value: 2 },
  { label: '乐心（动态报告）', value: 3 },
  { label: '乐普（AI报告）', value: 4 },
  { label: '互云（报告解读）', value: 5 },
  { label: '心阅纳龙（动态报告）', value: 6 },
  { label: '乐心（实体商品）', value: 7 }
]

const productExternalRelevanceInfoOptions = [
  { label: 'IOS应用内购产品ID', value: 'iosInAppPurchaseProductId' }
]

const submissionStatusOptions = [
  { label: '未提交', value: 0 },
  { label: '提交中', value: 1 },
  { label: '提交完成', value: 2 },
  { label: '提交失败', value: 3 }
]

const interpretationStatusOptions = [
  { label: '已解读', value: 1 },
  { label: '解读失败', value: 2 }
]

const pdfNumberOptions = [
  { label: '新增', value: 'increase' },
  { label: '减少', value: 'decrease' }
]

const dataStatisticsReportTypeOptions = [
  { label: '健康报告', value: 1 },
  { label: '动态报告', value: 2 },
  { label: 'AI报告', value: 3 }
]

const platformSourceOptions = [
  { label: '荣之创小程序', value: 1 },
  { label: '至意深心小程序', value: 2 },
  { label: '后台手动录入', value: 6 }
]

export {
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
  snCodeModeOptions,
  eventsOptions,
  symptomLabelOptions,
  giVenReportTypeOptions,
  shelfStatusOptions,
  productTypeOptions,
  sourceProviderOptions,
  productExternalRelevanceInfoOptions,
  submissionStatusOptions,
  interpretationStatusOptions,
  pdfNumberOptions,
  dataStatisticsReportTypeOptions,
  platformSourceOptions
}
