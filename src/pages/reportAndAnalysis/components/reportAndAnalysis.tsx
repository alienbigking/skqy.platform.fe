import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './reportAndAnalysis.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  message,
  Select,
  Spin,
  Table
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EFormatAnalysisState, IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { organizationBusinessService } from '@/pages/organizationBusiness/services'
import {
  analysisStateOptions,
  dataURLToBlob,
  filterAnalysisState,
  filterPositiveLevelResult,
  gender,
  positiveLevelResultOptions
} from '@/utils'
import { commonService } from '@/pages/common/services'
import { pdfjs } from 'react-pdf'
import { Permission } from '@/components/permission'
import SendReport from './sendReport'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { reportAndAnalysisService } from '../services'
import SubmitReportAndAnalysis from './submitReportAndAnalysis'
import { env } from '@/config/env'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const cmaps = `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`

interface Props {}

type FieldType = {
  id?: string
  name?: string
  status?: string
  positiveLevel?: string
}

interface DataType {
  [key: string]: any
}

const ReportAndAnalysis: React.FC<Props> = (props) => {
  const {} = props
  const [downloadLoading, setDownloadLoading] = useState(false)

  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [pageNumber, setPageNumber] = useState(1)
  const [uint8ArrayPDF, setUint8ArrayPDF] = useState<any>(null)
  const [isVisibleSendReport, setIsVisibleSendReport] = useState(false)
  const [isVisibleSubmitReportAnalysis, setIsVisibleSubmitReportAnalysis] =
    useState(false)
  const [isAiReportAudit, setIsAiReportAudit] = useState(false)

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    // {
    //   title: '数据识别号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (value) => <span>{value}</span>
    // },

    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 128,
      render: (value) => <span>{value}</span>
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      fixed: 'left',
      width: 60,
      render: (value) => <span>{gender(value)}</span>
    },
    {
      title: '设备SN码',
      dataIndex: 'sn',
      key: 'sn',
      width: 180,
      render: (value) => <span>{value}</span>
    },
    {
      title: '佩戴开始时间',
      dataIndex: 'wearStartTime',
      key: 'wearStartTime',
      width: 180,
      render: (value) => (
        <span>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
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
      title: '分析入口',
      dataIndex: 'innerBusinessName',
      key: 'innerBusinessName',
      width: 220,
      render: (value, record) => (
        <div>
          <Permission code="reportAndAnalysis.list.local.analysis">
            <Button
              disabled={
                record?.status === EFormatAnalysisState.wear ||
                record?.status === EFormatAnalysisState.preAnalysis
              }
              type="link"
              size="small"
              onClick={() => onLocalAnalysis(record)}
            >
              本地分析
            </Button>
          </Permission>
          {/*<Permission code="reportAndAnalysis.list.local.analysis">*/}
          {/*  <Button*/}
          {/*    disabled={*/}
          {/*      record?.status === EFormatAnalysisState.wear ||*/}
          {/*      record?.status === EFormatAnalysisState.preAnalysis*/}
          {/*    }*/}
          {/*    type="link"*/}
          {/*    size="small"*/}
          {/*    onClick={() => onAiReportAudit(record)}*/}
          {/*  >*/}
          {/*    AI报告审核*/}
          {/*  </Button>*/}
          {/*</Permission>*/}
        </div>
      )
    },
    {
      title: '阳性等级',
      dataIndex: 'positiveLevel',
      key: 'positiveLevel',
      width: 100,
      render: (value) => <span>{filterPositiveLevelResult(value)}</span>
    },
    {
      title: '检查结论',
      dataIndex: 'conclusion',
      width: 400,
      key: 'conclusion',
      render: (value) => <span>{value}</span>
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
      render: (value, record) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="reportAndAnalysis.list.submit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onSubmitReportAnalysis(value)}
            >
              提交动态报告
            </Button>
          </Permission>
          {/*<Permission code="reportManagement.list.submit">*/}
          {/*  <Button*/}
          {/*    disabled={*/}
          {/*      record?.status !== EFormatAnalysisState.analysisCompletion*/}
          {/*    }*/}
          {/*    type="text"*/}
          {/*    className={cn(['gGeneralTextButton'])}*/}
          {/*    onClick={() => onSend(record)}*/}
          {/*  >*/}
          {/*    发送报告*/}
          {/*  </Button>*/}
          {/*</Permission>*/}

          <Permission code="reportAndAnalysis.list.dynamic.image.download">
            <Spin tip="下载中" spinning={record.dynamicPDFSpinning}>
              <Button
                disabled={!record?.lePuReportOssId}
                type="text"
                className={cn(['gGeneralTextButton'])}
                onClick={() => onDynamicPDFDownload(record)}
              >
                下载动态报告
              </Button>
            </Spin>
          </Permission>

          {/*{record.auxiliaryExaminationReportOssId && (*/}
          {/*  <div className={cn(styles.btns)}>*/}
          {/*    <Permission code="reportManagement.list.dynamic.image.download">*/}
          {/*      <Spin tip="下载中" spinning={record.dynamicImageSpinning}>*/}
          {/*        <Button*/}
          {/*          type="text"*/}
          {/*          className={cn(['gGeneralTextButton'])}*/}
          {/*          onClick={() => onDynamicImageDownload(record)}*/}
          {/*        >*/}
          {/*          动态报告图片下载*/}
          {/*        </Button>*/}
          {/*      </Spin>*/}
          {/*    </Permission>*/}
          {/*    <Permission code="reportManagement.list.dynamic.image.download">*/}
          {/*      <Spin tip="下载中" spinning={record.dynamicPDFSpinning}>*/}
          {/*        <Button*/}
          {/*          type="text"*/}
          {/*          className={cn(['gGeneralTextButton'])}*/}
          {/*          onClick={() => onDynamicPDFDownload(record)}*/}
          {/*        >*/}
          {/*          动态报告PDF下载*/}
          {/*        </Button>*/}
          {/*      </Spin>*/}
          {/*    </Permission>*/}
          {/*  </div>*/}
          {/*)}*/}

          {/*{record.healthReportOssId && (*/}
          {/*  <>*/}
          {/*    <Permission code="reportManagement.list.health.image.download">*/}
          {/*      <Spin tip="下载中" spinning={record.healthImageSpinning}>*/}
          {/*        <Button*/}
          {/*          type="text"*/}
          {/*          className={cn(['gGeneralTextButton'])}*/}
          {/*          onClick={() => onHealthImageDownload(record)}*/}
          {/*        >*/}
          {/*          健康报告图片下载*/}
          {/*        </Button>*/}
          {/*      </Spin>*/}
          {/*    </Permission>*/}
          {/*    <Permission code="reportManagement.list.health.pdf.download">*/}
          {/*      <Spin tip="下载中" spinning={record.healthPDFSpinning}>*/}
          {/*        <Button*/}
          {/*          type="text"*/}
          {/*          className={cn(['gGeneralTextButton'])}*/}
          {/*          onClick={() => onHealthPDFDownload(record)}*/}
          {/*        >*/}
          {/*          健康报告PDF下载*/}
          {/*        </Button>*/}
          {/*      </Spin>*/}
          {/*    </Permission>*/}
          {/*  </>*/}
          {/*)}*/}
        </div>
      )
    }
  ]

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await reportAndAnalysisService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的报告与分析列表', data)

    setTableData(
      data.list?.map((item: any) => {
        item.dynamicImageSpinning = false
        item.dynamicPDFSpinning = false
        item.healthImageSpinning = false
        item.healthPDFSpinning = false
        return item
      })
    )
    setTotal(data.total)
  }, [pagination])

  const onDelete = async (value: any) => {
    const data = await organizationBusinessService.delete(value.id)
    if (data.code === '200') {
      message.success('删除报告分析成功')
      getList()
    }
  }
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

  const onSubmitReportAnalysis = (value: any) => {
    setIsVisibleSubmitReportAnalysis(true)
    setRowData(value)
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
  }

  const onAiReportAudit = (value: any) => {
    setRowData(value)
    setIsAiReportAudit(true)
  }

  const onDynamicImageDownload = async (value: any) => {
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.dynamicImageSpinning) {
          item.dynamicImageSpinning = true
          console.log('触发了', item)
        }
        return item
      })
    )
    const url = await getDownloadURL(value)
    pdfTurnPicture(url, value)
  }

  const onDynamicPDFDownload = async (value: any) => {
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.dynamicPDFSpinning) {
          item.dynamicPDFSpinning = true
        }
        return item
      })
    )
    const url = await getDownloadURL(value)
    downLoadFile(url, value)
  }

  const onHealthImageDownload = async (value: any) => {
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.healthImageSpinning) {
          item.healthImageSpinning = true
        }
        return item
      })
    )
    const url = await getDownloadURL(value)
    pdfTurnPicture(url, value)
  }

  const onHealthPDFDownload = async (value: any) => {
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.healthPDFSpinning) {
          item.healthPDFSpinning = true
        }
        return item
      })
    )
    const url = await getDownloadURL(value)
    downLoadFile(url, value)
  }

  const onSend = async (value: any) => {
    setIsVisibleSendReport(true)
    setRowData(value)
  }

  const getDownloadURL = async (value: any) => {
    console.log('下载文件链接', value)
    const { code, data } = await commonService.getDownloadUrl(
      value.auxiliaryExaminationReportOssId
    )
    console.log('获取的文件下载链接', data)
    if (code === '200') {
      return data.url
    }
  }
  const pdfTurnPicture = async (pdfUrl: string, value: any) => {
    try {
      const blob = await commonService.download(pdfUrl, false)

      const loadingTask = pdfjs.getDocument({
        data: blob,
        cMapUrl: cmaps,
        cMapPacked: true
      })

      loadingTask.promise.then((pdf) => {
        console.log('加载了', pdf)
        const totalPages = pdf.numPages
        console.log('pdf文件页数', totalPages)
        const promises: Promise<void>[] = []
        let imgs: any[] = []
        // const canvasContainer: any = document.getElementById('canvas-container')
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          promises.push(
            pdf
              .getPage(pageNumber)
              .then(async (page) => {
                const scale = 2
                const viewport = page.getViewport({
                  scale,
                  rotation: 0
                })
                // console.log('viewport对象', viewport)
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                if (!context) {
                  throw new Error('绘制失败')
                }
                canvas.height = viewport.height
                canvas.width = viewport.width

                console.log(
                  `Page ${pageNumber} - PDF 页面宽度: ${viewport.width}, 高度: ${viewport.height}`
                )

                return page
                  .render({ canvasContext: context, viewport })
                  .promise.then(() => {
                    // 将Canvas元素添加到容器中
                    // canvasContainer.appendChild(canvas)
                    const imgUrl = canvas.toDataURL('image/png')
                    imgs.push({ index: pageNumber, url: imgUrl })
                  })
              })
              .catch((error) => {
                console.error(`Error processing page ${pageNumber}`, error)
              })
          )
        }

        Promise.allSettled(promises).then(() => {
          let zip = new JSZip()

          console.log('图片数组', imgs)
          imgs.forEach((item, index) => {
            // 将Blob对象添加到zip文件中
            const blob = dataURLToBlob(item.url)
            zip.file(`${item.index}_${value.id}_${value.name}.png`, blob)
          })

          // 生成zip文件并保存
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `${value.id}_${value.name}.zip`)
          })
        })
      })
    } catch (error) {
      console.error('文件异常', error)
    } finally {
      setTableData(
        tableData.map((item) => {
          if (item.id === value.id && item.dynamicImageSpinning) {
            item.dynamicImageSpinning = false
          } else if (item.id === value.id && item.dynamicPDFSpinning) {
            item.dynamicPDFSpinning = false
          } else if (item.id === value.id && item.healthImageSpinning) {
            item.healthImageSpinning = false
          } else if (item.id === value.id && item.healthPDFSpinning) {
            item.healthPDFSpinning = false
          }
          return item
        })
      )
    }
  }

  const downLoadFile = async (fileUrl: string, value: any) => {
    const blob = await commonService.download(fileUrl)
    const url = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = `${value.id}_${value.name}.pdf`
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && item.dynamicImageSpinning) {
          item.dynamicImageSpinning = false
        } else if (item.id === value.id && item.dynamicPDFSpinning) {
          item.dynamicPDFSpinning = false
        } else if (item.id === value.id && item.healthImageSpinning) {
          item.healthImageSpinning = false
        } else if (item.id === value.id && item.healthPDFSpinning) {
          item.healthPDFSpinning = false
        }
        return item
      })
    )
  }
  const handleNewOk = () => {
    console.log('操作成功')
    getList()
    setIsVisibleSubmitReportAnalysis(false)
    setIsAiReportAudit(false)
  }

  return (
    <div className={cn(styles.reportAndAnalysis)}>
      {/*<div id="canvas-container"></div>*/}
      <HeaderWrapper
        title="报告与分析"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        {/*<Col span={6}>*/}
        {/*  <Form.Item<FieldType>*/}
        {/*    label="数据识别号"*/}
        {/*    name="id"*/}
        {/*    rules={[{ required: false, message: '请输入数据识别号' }]}*/}
        {/*  >*/}
        {/*    <Input placeholder="请输入数据识别号" allowClear />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}
        <Col span={6}>
          <Form.Item<FieldType>
            label="姓名"
            name="name"
            rules={[{ required: false, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" allowClear />
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
              scroll={{ x: 'max-content' }}
              // scroll={{ x: 1500, y: 650 }}
              // sticky={{ offsetHeader: 0 }}
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

        <SendReport
          rowData={rowData}
          isVisible={isVisibleSendReport}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleSendReport(false)}
        />

        <SubmitReportAndAnalysis
          rowData={rowData}
          isVisible={isVisibleSubmitReportAnalysis}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleSubmitReportAnalysis(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default ReportAndAnalysis
