import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './reportManagement.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'
import { Button, Col, Form, Input, message, Spin, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { organizationBusinessService } from '@/pages/organizationBusiness/services'
import { dataURLToBlob, filterChannelStatus, gender } from '@/utils'
import { reportManagementService } from '@/pages/reportManagement/services'
import { commonService } from '@/pages/common/services'
import { pdfjs } from 'react-pdf'
import SubmitReport from '@/pages/reportManagement/components/submitReport'
import { Permission } from '@/components/permission'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const cmaps = `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`

interface Props {}

type FieldType = {
  id?: string
  name?: string
}

interface DataType {
  [key: string]: any
}

const ReportManagement: React.FC<Props> = (props) => {
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
  const [isVisibleSubmitReport, setIsVisibleSubmitReport] = useState(false)

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
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
      title: '佩戴开始时间',
      dataIndex: 'wearStartTime',
      key: 'wearStartTime',
      render: (value) => (
        <span>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (value) => (
    //     <span>
    //       <Badge
    //         status={
    //           value === EFormatAnalysisState.wear
    //             ? 'error'
    //             : value === EFormatAnalysisState.preAnalysis
    //             ? 'warning'
    //             : 'success'
    //         }
    //         text={filterAnalysisState(value)}
    //       />
    //     </span>
    //   )
    // },
    {
      title: '是否提交机构',
      dataIndex: 'channelStatus',
      key: 'channelStatus',
      render: (value) => <span>{filterChannelStatus(value)}</span>
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
      render: (value, record) => (
        <div className={cn(styles.tableActions)}>
          {record.auxiliaryExaminationReportOssId && (
            <div className={cn(styles.btns)}>
              <Permission code="reportManagement.list.dynamic.image.download">
                <Spin tip="下载中" spinning={record.dynamicImageSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onDynamicImageDownload(record)}
                  >
                    动态报告图片下载
                  </Button>
                </Spin>
              </Permission>
              <Permission code="reportManagement.list.dynamic.image.download">
                <Spin tip="下载中" spinning={record.dynamicPDFSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onDynamicPDFDownload(record)}
                  >
                    动态报告PDF下载
                  </Button>
                </Spin>
              </Permission>
            </div>
          )}

          {record.healthReportOssId && (
            <>
              <Permission code="reportManagement.list.health.image.download">
                <Spin tip="下载中" spinning={record.healthImageSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onHealthImageDownload(record)}
                  >
                    健康报告图片下载
                  </Button>
                </Spin>
              </Permission>
              <Permission code="reportManagement.list.health.pdf.download">
                <Spin tip="下载中" spinning={record.healthPDFSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onHealthPDFDownload(record)}
                  >
                    健康报告PDF下载
                  </Button>
                </Spin>
              </Permission>
            </>
          )}
          {record.lePuReportOssId && (
            <>
              <Permission code="reportManagement.list.ai.image.download">
                <Spin tip="下载中" spinning={record.aiImageSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onAIImageDownload(record)}
                  >
                    AI报告图片下载
                  </Button>
                </Spin>
              </Permission>
              <Permission code="reportManagement.list.ai.pdf.download">
                <Spin tip="下载中" spinning={record.aiPDFSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onAIPDFDownload(record)}
                  >
                    AI报告PDF下载
                  </Button>
                </Spin>
              </Permission>
            </>
          )}
          {record.lePuReportOssId && (
            <>
              <Permission code="reportManagement.list.profession.image.download">
                <Spin tip="下载中" spinning={record.aiImageSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onAIImageDownload(record)}
                  >
                    专业报告图片下载
                  </Button>
                </Spin>
              </Permission>
              <Permission code="reportManagement.list.profession.pdf.download">
                <Spin tip="下载中" spinning={record.aiPDFSpinning}>
                  <Button
                    type="text"
                    className={cn(['gGeneralTextButton'])}
                    onClick={() => onAIPDFDownload(record)}
                  >
                    专业报告PDF下载
                  </Button>
                </Spin>
              </Permission>
            </>
          )}
          <Permission code="reportManagement.list.submit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onSubmit(record)}
            >
              提交机构
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
    const { data } = await reportManagementService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的报告管理列表', data)
    setTableData(
      data.list?.map((item: any) => {
        item.dynamicImageSpinning = false
        item.dynamicPDFSpinning = false
        item.healthImageSpinning = false
        item.healthPDFSpinning = false
        item.aiImageSpinning = false
        item.aiPDFSpinning = false
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

  const onNew = () => {}

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
    const url = await getDownloadURL(value, 'dynamic')
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
    const url = await getDownloadURL(value, 'dynamic')
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
    const url = await getDownloadURL(value, 'health')
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
    const url = await getDownloadURL(value, 'health')
    downLoadFile(url, value)
  }
  const onAIImageDownload = async (value: any) => {
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.aiImageSpinning) {
          item.aiImageSpinning = true
        }
        return item
      })
    )
    const url = await getDownloadURL(value, 'AI')
    pdfTurnPicture(url, value)
  }

  const onAIPDFDownload = async (value: any) => {
    setTableData(
      tableData.map((item) => {
        if (item.id === value.id && !item.aiPDFSpinning) {
          item.aiPDFSpinning = true
        }
        return item
      })
    )
    const url = await getDownloadURL(value, 'AI')
    downLoadFile(url, value)
  }

  const onSubmit = async (value: any) => {
    setIsVisibleSubmitReport(true)
    setRowData(value)
  }

  const getDownloadURL = async (value: any, type: string) => {
    const { code, data } = await commonService.getDownloadUrl(
      type === 'dynamic'
        ? value.auxiliaryExaminationReportOssId
        : type === 'health'
        ? value.healthReportOssId
        : value.lePuReportOssId
    )
    console.log('获取的文件下载链接', data)
    if (code === '200') {
      return data.url
    } else {
      message.error('下载失败')
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
          } else if (item.id === value.id && item.aiImageSpinning) {
            item.aiImageSpinning = false
          } else if (item.id === value.id && item.aiPDFSpinning) {
            item.aiPDFSpinning = false
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
        } else if (item.id === value.id && item.aiImageSpinning) {
          item.aiImageSpinning = false
        } else if (item.id === value.id && item.aiPDFSpinning) {
          item.aiPDFSpinning = false
        }
        return item
      })
    )
  }
  const handleNewOk = () => {
    console.log('操作成功')
    getList()
  }

  return (
    <div className={cn(styles.reportManagement)}>
      {/*<div id="canvas-container"></div>*/}
      <HeaderWrapper
        title="报告管理"
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
          <Form.Item<FieldType>
            label="姓名"
            name="name"
            rules={[{ required: false, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" allowClear />
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

        <SubmitReport
          rowData={rowData}
          isVisible={isVisibleSubmitReport}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleSubmitReport(false)}
        />

        {/*<ReportAndAnalysisEdit*/}
        {/*  rowData={rowData}*/}
        {/*  isVisible={isVisibleEdit}*/}
        {/*  handleOk={handleNewOk}*/}
        {/*  handleCancel={() => setIsVisibleEdit(false)}*/}
        {/*/>*/}
      </ContentWrapper>
    </div>
  )
}

export default ReportManagement
