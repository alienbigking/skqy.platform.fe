import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './reportAnalysis.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Badge, Button, Col, Form, Input, message, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ReportAnalysisNew from './reportAnalysisNew'
import { EFormatAnalysisState, IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import SubmitReportAnalysis from './submitReportAnalysis'
import {
  analysisStateOptions,
  filterAnalysisState,
  filterInspectionResult,
  filterPositiveLevelResult,
  gender,
  positiveLevelResultOptions,
  storage
} from '@/utils'
import { reportAnalysisService } from '@/pages/reportAnalysis/services'
import HistoricalConclusion from '@/pages/reportAnalysis/components/historicalConclusion'
import { env } from '@/config/env'
import { commonService } from '@/pages/common/services'
import { Permission } from '@/components/permission'
import AiReportAnalysis from '@/pages/reportAnalysis/components/aiReportAnalysis'
import AiAutoReportAudit from './aiAutoReportAudit'
import ApplyDynamicReport from './applyDynamicReport'

interface Props {}

type FieldType = {
  id?: string
  status?: string
  positiveLevel?: string
}

interface IColumns {
  id: string
  name: string
  age: number
  gender: string
  wearStartTime: string
  status: string
  positive: number
  positiveLevel: string
  medicalHistory: string
  innerBusinessName: string
  lePuReportOssId: string
  healthReportOssId: string
  auxiliaryExaminationReportOssId: string
  autoPositive: number

  organization: {
    [key: string]: any
  }
}

const ReportAnalysis: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleSubmitReportAnalysis, setIsVisibleSubmitReportAnalysis] =
    useState(false)
  const [isVisibleHistoricalConclusion, setIsVisibleHistoricalConclusion] =
    useState(false)
  const [isVisibleAiReportAnalysis, setIsVisibleAiReportAnalysis] =
    useState(false)
  const [isAiReportAudit, setIsAiReportAudit] = useState(false)
  const [isVisibleAiAutoReportAudit, setIsVisibleAiAutoReportAudit] =
    useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<IColumns[]>([])
  const [total, setTotal] = useState(0)
  const [isVisibleApplyDynamicReport, setIsVisibleApplyDynamicReport] =
    useState(false)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  const columns: ColumnsType<IColumns> = [
    {
      title: '数据识别号',
      dataIndex: 'id',
      key: 'id',
      render: (value) => <span>{value}</span>
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (value) => <span>{gender(value)}</span>
    },
    {
      title: '分析入口',
      dataIndex: 'innerBusinessName',
      key: 'innerBusinessName',
      render: (value, record) => (
        <div>
          <Permission code="reportAnalysis.list.local.analysis">
            <Button
              type="link"
              size="small"
              onClick={() => onLocalAnalysis(record)}
            >
              本地分析
            </Button>
          </Permission>
          <Permission code="reportAnalysis.list.dynamic.analysis">
            <Button
              type="link"
              size="small"
              onClick={() => onDynamicAnalysis(record)}
            >
              动态分析
            </Button>
          </Permission>
          <Permission code="reportAnalysis.list.health.reports">
            <Button
              type="link"
              size="small"
              onClick={() => onHealthReports(record)}
            >
              健康报告
            </Button>
          </Permission>
          <Permission code="reportAnalysis.list.ai.reports">
            {/*一般机构或保博*/}
            {(record?.organization?.aiManualReportActive ||
              (!record?.organization?.aiManualReportActive &&
                record?.organization?.aiReportActive &&
                record.positive === 2)) && (
              <Button
                type="link"
                size="small"
                onClick={() => onAIReports(record)}
                disabled={!record?.lePuReportOssId}
              >
                AI人工报告分析
              </Button>
            )}
          </Permission>
          <Permission code="reportAnalysis.list.ai.atuo.reports.audit">
            {record.autoPositive !== 0 &&
              record?.organization?.aiReportActive && (
                <Button
                  disabled={!record?.lePuReportOssId}
                  type="link"
                  size="small"
                  onClick={() => onAiAutoReportAudit(record)}
                >
                  AI自动报告审核
                </Button>
              )}
          </Permission>
        </div>
      )
    },
    {
      title: '申请出具报告(至意深心小程序)',
      dataIndex: 'innerBusinessName',
      key: 'innerBusinessName',
      render: (value, record) => (
        <div>
          <Permission code="reportAnalysis.list.apply.issuance.ai.report">
            <Button
              type="link"
              size="small"
              onClick={() => onApplyIssuanceAiReport(record)}
            >
              专业报告
            </Button>
          </Permission>
          <Permission code="reportAnalysis.list.apply.issuance.nl.dynamic.report">
            <Button
              type="link"
              size="small"
              onClick={() => onApplyIssuanceNlDynamicReport(record)}
            >
              纳龙动态报告
            </Button>
          </Permission>
        </div>
      )
    },
    {
      title: '所属机构',
      dataIndex: 'organization',
      key: 'organization',
      render: (value, record) => <span>{value?.name}</span>
    },
    {
      title: '佩戴开始时间',
      dataIndex: 'wearStartTime',
      key: 'wearStartTime',
      render: (value) => (
        <span>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <span>
          <Badge
            status={
              value === EFormatAnalysisState.wear
                ? 'error'
                : value === EFormatAnalysisState.preAnalysis
                ? 'warning'
                : value === EFormatAnalysisState.analyzed
                ? 'success'
                : value === EFormatAnalysisState.pendingAnalysisCompletion
                ? 'warning'
                : value === EFormatAnalysisState.analysisCompletion
                ? 'success'
                : 'error'
            }
            text={filterAnalysisState(value)}
          />
        </span>
      )
    },

    {
      title: '检查结果',
      dataIndex: 'positive',
      key: 'positive',
      render: (value) => <span>{filterInspectionResult(value)}</span>
    },
    {
      title: '阳性等级',
      dataIndex: 'positiveLevel',
      key: 'positiveLevel',
      render: (value) => <span>{filterPositiveLevelResult(value)}</span>
    },

    {
      title: '既往病史',
      dataIndex: 'medicalHistory',
      key: 'medicalHistory',
      render: (value) => <span>{value}</span>
    },
    {
      title: '检查结论',
      dataIndex: 'conclusion',
      key: 'conclusion',
      render: (value) => <span>{value}</span>
    },

    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (value, record) => (
        <div>
          <span> {value}</span>
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="reportAnalysis.list.submit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onSubmit(value)}
            >
              提交本地报告结论
            </Button>
          </Permission>
          <Permission code="reportAnalysis.list.history">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onHistory(value)}
            >
              历史结论
            </Button>
          </Permission>
          <Permission code="reportAnalysis.list.pass.back">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onPassBack(value)}
            >
              本地报告一键回传
            </Button>
          </Permission>
        </div>
      )
    }
  ]

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await reportAnalysisService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的报告分析列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [pagination])

  const onSearch = (values: any) => {
    setPagination({
      pageNum: 1,
      pageSize: pagination.pageSize
    })
  }

  const onReset = () => {
    setPagination({
      pageNum: 1,
      pageSize: 10
    })
  }

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters)
    setPagination({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onSubmit = (value: any) => {
    setIsVisibleSubmitReportAnalysis(true)
    setRowData(value)
  }

  const onHistory = (value: any) => {
    setRowData(value)
    setIsVisibleHistoricalConclusion(true)
  }

  const onPassBack = (value: any) => {
    window.location.replace(
      `YuanXinTool://report/${value.id}_${value.channelId || ''}_${
        value.name || ''
      }_F?version=2&env=${env.UMI_ENV === 'production' ? 2 : 1}`
    )
  }

  const onLocalAnalysis = async (value: any) => {
    console.log('本地分析', value)

    const { code, data, msg } = await commonService.updateEcgAnalysisStatus({
      id: value.id,
      status: 3
    })

    // if (code !== '200') {
    //   message.error(msg)
    //   return
    // }

    window.location.replace(
      `YuanXinTool://${value.id}_${value.channelId || ''}_${encodeURIComponent(
        value.name
      )}_F?version=2&env=${env.UMI_ENV === 'production' ? 2 : 1}&signed=${
        value.signed
      }`
    )

    // let url = `YuanXinTool://${value.id}_${value.channelId || ''}_${
    //   value.name
    // }_F?version=2&env=${env.UMI_ENV === 'production' ? 2 : 1}&signed=${
    //   value.signed
    // }`
    //
    // window.location.href = url
  }

  const onDynamicAnalysis = async (value: any) => {
    commonService.updateEcgAnalysisStatus({
      id: value.id,
      status: 3
    })
    const { code, data } = await commonService.getConnectWorkbench({
      id: value.id
    })
    console.log('获取的连接数据', value, data)

    if (code === '200') {
      if (value.id && value.organizationName) {
        window.open(
          `${env.GUACAMOLE_URL}?token=${data}&fid=${value.organizationName}/${value.id}`,
          '_blank'
        )
      } else {
        window.open(`${env.GUACAMOLE_URL}?token=${data}`, '_blank')
      }
    }
  }

  const onHealthReports = (value: any) => {
    // window.open(
    //   `${env.HOST_ANALYSIS_SERVICE_API_URL}?jumpTo=report&mask=178&id=${
    //     value.id
    //   }&style=0&token=${storage.getSession('token')}`
    // )
    window.open(
      `${env.HOST_ANALYSIS_SERVICE_API_URL}?id=${value.id}&source=${
        env.UMI_ENV === 'develop' || env.UMI_ENV === 'stage'
          ? 'nextTest'
          : env.UMI_ENV === 'localDeploy'
          ? 'localDeploy'
          : 'nextProd'
      }&style=0&token=${storage.getSession('token')}#/healthReport`
    )
  }
  const onApplyIssuanceAiReport = async (value: any) => {
    const { code, data, msg } =
      await reportAnalysisService.applyIssuanceAiReport({
        id: value.id
      })

    if (code === '200') {
      message.success('申请出具AI报告成功')
    } else {
      message.error(msg)
    }
  }
  const onApplyIssuanceNlDynamicReport = async (value: any) => {
    setRowData(value)
    setIsVisibleApplyDynamicReport(true)
  }
  const onAiAutoReportAudit = (value: any) => {
    setRowData(value)
    setIsVisibleAiAutoReportAudit(true)
  }
  const onAIReports = (value: any) => {
    setRowData(value)
    setIsVisibleAiReportAnalysis(true)
  }
  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleSubmitReportAnalysis(false)
    setIsVisibleHistoricalConclusion(false)
    setIsVisibleAiReportAnalysis(false)
    setIsVisibleAiAutoReportAudit(false)
    setIsVisibleApplyDynamicReport(false)
    getList()
  }

  return (
    <div className={cn(styles.reportAnalysis)}>
      <HeaderWrapper
        title="报告分析"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="数据识别号"
            name="id"
            rules={[{ required: false, message: '请输入数据识别号' }]}
          >
            <Input placeholder="请输入数据识别号" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="状态" name="status">
            <Select placeholder="请选择状态" options={analysisStateOptions} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="阳性等级" name="positiveLevel">
            <Select
              placeholder="请选择阳性等级"
              options={positiveLevelResultOptions}
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          {/*<div className={cn(styles.actions)}>*/}
          {/*  <Button*/}
          {/*    icon={<PlusOutlined />}*/}
          {/*    className={cn(['gMainButton'])}*/}
          {/*    type="primary"*/}
          {/*    onClick={onNew}*/}
          {/*  >*/}
          {/*    新增*/}
          {/*  </Button>*/}
          {/*</div>*/}
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              onChange={onChangeTable}
              // sticky={true}
              scroll={{ x: 'max-content' }}
              pagination={{
                total: total,
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <ReportAnalysisNew
          isVisible={isVisibleNew}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <SubmitReportAnalysis
          rowData={rowData}
          isVisible={isVisibleSubmitReportAnalysis}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleSubmitReportAnalysis(false)}
        />

        <HistoricalConclusion
          rowData={rowData}
          isVisible={isVisibleHistoricalConclusion}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleHistoricalConclusion(false)}
        />
        <AiReportAnalysis
          rowData={rowData}
          isVisible={isVisibleAiReportAnalysis}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleAiReportAnalysis(false)}
        />
        <AiAutoReportAudit
          rowData={rowData}
          isVisible={isVisibleAiAutoReportAudit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleAiAutoReportAudit(false)}
        />
        <ApplyDynamicReport
          rowData={rowData}
          isVisible={isVisibleApplyDynamicReport}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleApplyDynamicReport(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default ReportAnalysis
