import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
  UploadFile
} from 'antd'
import cn from 'classnames'
import styles from './aiReportAnalysis.less'
import { inspectionResultOptions, positiveLevelResultOptions } from '@/utils'
import { commonService } from '@/pages/common/services'
import { pdfjs } from 'react-pdf'
import { PDFDocument } from 'pdf-lib'
import { clone } from 'lodash'
import loginImageURl from '@/assets/images/login.png'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import ReactQuill from 'react-quill'
import { reportAnalysisService } from '@/pages/reportAnalysis/services'
import DayJS from 'dayjs'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
const cmaps = `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`

const { RangePicker } = DatePicker
const { Dragger } = Upload

const { TextArea } = Input

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  conclusion?: string
  positive?: string
  positiveLevel?: string
  description?: string
  synthesisConclusion?: string
}

const AiReportAnalysis: React.FC<Props> = memo((props) => {
  const { isVisible = false, rowData, handleOk, handleCancel } = props
  const [organizationBusinessOptions, setOrganizationBusinessOptions] =
    useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<Blob>() // 当前 PDF Blob
  const [updatedPdfBlob, setUpdatedPdfBlob] = useState<Blob>() // 更新后的 PDF Blob
  const [numPages, setNumPages] = useState(1) // PDF 的页数
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [innerHTMLRemark, setInnerHTMLRemark] = useState<string>('')
  const [synthesisConclusion, setSynthesisConclusion] = useState('')
  const [isUploadSuccess, setIsUploadSuccess] = useState(false)
  const [isPreView, setIsPreView] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [preViewLoading, setPreViewLoading] = useState(false)

  const [form] = Form.useForm()
  let fileOssIdRef = useRef({
    id: ''
  })
  const iframePDFRef = useRef<HTMLIFrameElement>(null)
  const htmlRef = useRef<HTMLDivElement>(null)

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' }
      ],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image'
  ]

  useEffect(() => {
    if (isVisible) {
      downloadAndPreviewPdf()
    }
    return () => {
      console.log('清空了')
      handleClear()
    }
  }, [isVisible])

  useEffect(() => {
    if (iframePDFRef.current && pdfBlobUrl) {
      iframePDFRef.current.src = pdfBlobUrl // 设置 iframe src
      console.log('设置iframe src 值', iframePDFRef.current.src)
    }
  }, [pdfBlobUrl])

  useEffect(() => {
    if (synthesisConclusion && innerHTMLRemark && isSubmit) {
      console.log(
        '表单信息填写完成，开始生成并提交 PDF...',
        synthesisConclusion,
        innerHTMLRemark
      )
      appendPageToPdf()
    }
  }, [synthesisConclusion, innerHTMLRemark, isSubmit])

  useEffect(() => {
    if (updatedPdfBlob && isUploadSuccess) {
      console.log('处理文件上传成功后的')
      handleUpload()
    }
  }, [updatedPdfBlob])

  useEffect(() => {
    if (isPreView) {
      console.log('开始预览 PDF...')
      appendPageToPdf()
    }
  }, [isPreView])

  const getDownloadURL = async (value: any) => {
    const { code, data } = await commonService.getDownloadUrl(
      value.lePuReportOssId
    )
    console.log('获取的文件下载链接', data)
    if (code === '200') {
      return data.url
    } else {
      message.error('下载失败')
    }
  }

  // 下载并预览 PDF
  const downloadAndPreviewPdf = async () => {
    const fileUrl = await getDownloadURL(rowData)
    const arrayBuffer = await commonService.download(fileUrl)
    setPdfArrayBuffer(arrayBuffer)

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
    // 将 Blob 转换为临时 URL
    const pdfBlobUrl = URL.createObjectURL(blob)
    setPdfBlobUrl(pdfBlobUrl)
  }

  const onOk = async () => {
    const { synthesisConclusion, description } = await form.validateFields()
    console.log('内容字段')

    setSynthesisConclusion(synthesisConclusion)
    setInnerHTMLRemark(description)

    setIsUploadSuccess(true)
    setIsSubmit(true)
    setLoading(true)
  }

  const onCancel = () => {
    form.resetFields()
    setOrganizationBusinessOptions([])
    handleCancel?.()
    console.log('抽屉关闭了')
  }
  const onPreview = async () => {
    const { synthesisConclusion, description } = await form.validateFields()
    console.log('预览时表单内容', synthesisConclusion, description)

    setSynthesisConclusion(synthesisConclusion)
    setInnerHTMLRemark(description)
    setIsPreView(true)
    setPreViewLoading(true)
  }

  const handleUpload = async () => {
    const values = form.getFieldsValue()

    console.log('表单内容', values)

    try {
      await handleUploadFile()
      const data = await reportAnalysisService.uploadAIReportAnalysis({
        id: rowData.id,
        type: 3, // lepu AI报告
        ossId: fileOssIdRef.current?.id,
        ...values
      })

      if (data.code === '200') {
        setLoading(false)
        form.resetFields()

        message.success('AI报告分析成功')
        handleOk?.()
      } else {
        message.error(data.msg)

        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    } finally {
      setIsUploadSuccess(false) // 重置标志位
    }
  }
  const handleUploadFile = async () => {
    const file = new File([updatedPdfBlob as Blob], rowData.name + '.pdf')
    const pdfBlobUrl = URL.createObjectURL(updatedPdfBlob as Blob)
    console.log('上传处理上传的文件地址及名称', pdfBlobUrl, file)

    try {
      const res = await commonService.getUploadUrl({
        originalName: file.name
      })
      console.log('获取文件上传链接', res)
      const { code, data } = res
      fileOssIdRef.current = { id: data.id }

      if (code === '200') {
        await commonService.aliyunUpload({
          url: data.url,
          file: updatedPdfBlob as unknown as File
        })
        console.log('已上传到阿里云CDN服务器')
      }
    } catch (error) {
      // 处理任何可能的错误
      console.error('文件上传失败:', error)
      message.error('文件上传失败，请重新操作')
    }
  }

  const appendPageToPdf = async () => {
    console.log('开始处理 PDF...', pdfArrayBuffer)
    if (!pdfArrayBuffer) {
      return
    }

    // 将 HTML 转为 PDF 并获取字节数据
    const newPdfBytes = await handleHtmlToPDF()
    if (!newPdfBytes) {
      console.error('HTML 转 PDF 失败')
      return
    }

    // 使用 pdf-lib 加载现有 PDF
    const arrayBuffer = await pdfArrayBuffer.arrayBuffer()
    const clonedArrayBuffer = clone(arrayBuffer) // 克隆
    console.log('克隆后PDF文件...', clonedArrayBuffer)
    const pdfDoc = await PDFDocument.load(clonedArrayBuffer)

    const newPdfDoc = await PDFDocument.load(newPdfBytes)

    // 将所有新PDF页面 合并到现有 PDF
    const newPages = await pdfDoc.copyPages(
      newPdfDoc,
      newPdfDoc.getPageIndices()
    )
    newPages.forEach((page) => {
      pdfDoc.addPage(page)
    })

    // 保存新的 PDF
    const updatedPdfBytes = await pdfDoc.save()
    const newBlob = new Blob([updatedPdfBytes], { type: 'application/pdf' })
    setUpdatedPdfBlob(newBlob) // 更新 PDF Blob 数据

    const pdfBlobUrl = URL.createObjectURL(newBlob)
    setPdfBlobUrl(pdfBlobUrl)
    setIsPreView(false)
    setIsSubmit(false)
    setPreViewLoading(false)

    console.log('生成了新的PDF文件', pdfBlobUrl)
  }

  const onDocumentLoadError = (e: any) => {
    console.log('错误信息', e)
  }

  const handleHtmlToPDF = async () => {
    console.log('开始处理 HtmlToPDF...', htmlRef.current)
    try {
      const canvas = await html2canvas(htmlRef.current as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        imageTimeout: 10000,
        scrollX: 0,
        scrollY: 0,
        // 强制使用 GPU 加速（如果可用）
        onclone: (doc) => {
          console.log('克隆后的元素:', doc) // 检查克隆后的 DOM
        }
      })
      console.log('canvas执行完成', canvas)

      let contentWidth = canvas.width
      let contentHeight = canvas.height
      let pageHeight = (contentWidth / 595) * 842
      let leftHeight = contentHeight
      let position = 0
      let imgWidth = 595
      let imgHeight = (595 / contentWidth) * contentHeight
      let pageData = canvas.toDataURL('image/jpeg', 1.0)
      let PDF = new JsPDF('p', 'pt', 'a4', true)

      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 842
          //避免添加空白页
          if (leftHeight > 0) {
            PDF.addPage()
          }
        }
      }
      console.log('Html转换处理完成')
      const pdfBytes = PDF.output('arraybuffer')
      return new Uint8Array(pdfBytes)
    } catch (e) {
      console.log('转换异常', e)
    }
  }

  const dataURLtoFile = (dataUrl: any, fileName: string) => {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
  }

  const handleClear = () => {
    setPdfArrayBuffer(undefined)
    setUpdatedPdfBlob(undefined)
    setIsUploadSuccess(false)
    setPdfBlobUrl(null)
    setSynthesisConclusion('')
    setInnerHTMLRemark('')
    if (iframePDFRef.current?.src) {
      iframePDFRef.current.src = ''
    }
  }
  return (
    <Drawer
      className={cn(styles.aiReportAnalysis)}
      title="AI报告分析"
      open={isVisible}
      onClose={onCancel}
      width={'100%'}
      footer={
        <div className={cn(['gDrawerFooter'])}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            style={{ marginLeft: 16 }}
            onClick={onPreview}
            loading={preViewLoading}
          >
            预览
          </Button>
          <Button
            loading={loading}
            style={{ marginLeft: 16 }}
            className={cn(['gMainButton'])}
            type="primary"
            onClick={onOk}
          >
            提交
          </Button>
        </div>
      }
    >
      <div className={cn(styles.main)}>
        <div className={cn(styles.left)}>
          <div className={cn(styles.pdfConclusion)} ref={htmlRef}>
            <div className={cn(styles.main)}>
              <div className={cn(styles.content)}>
                <div className={cn(styles.headerInfo)}>
                  <img
                    alt="乐心平江logo"
                    src={loginImageURl}
                    className={cn([styles.logoImage])}
                  />
                  <span className={cn(styles.time)}>
                    记录时间：
                    {DayJS(rowData.createAt).format(
                      'YYYY年MM月DD日 HH时mm分ss秒'
                    )}
                  </span>
                </div>
                <div className={cn([styles.contentInfo])}>
                  <div className={cn([styles.title])}>综合结论</div>
                  <div className={cn([styles.value])}>
                    {synthesisConclusion}
                  </div>
                  <div className={cn([styles.line])}></div>
                  <div
                    className={cn([styles.remark])}
                    dangerouslySetInnerHTML={{ __html: innerHTMLRemark }}
                  />
                </div>
              </div>

              <div className={cn([styles.footer])}>
                {/*<div className={cn(styles.signature)}>*/}
                {/*  <span className={cn(styles.signatureTitle)}>*/}
                {/*    医生签名:_________________*/}
                {/*  </span>*/}
                {/*</div>*/}
                <div className={cn([styles.address])}>
                  <span className={cn([styles.zhAddress])}>
                    广东省深圳市宝安区西乡街道大铲湾蓝色未来科技园二期2栋3层
                  </span>
                  <span className={cn([styles.enAddress])}>
                    {`3F, Building 2, Dachan Bay Blue Future Science and Technology
                Park, Xixiang Street,Bao'an District,Shenzhen, Guangdong
                Province`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 原始 PDF 文件的预览 */}
          <div className={cn(styles.pdfPreview)}>
            <iframe
              ref={iframePDFRef}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="AI分析报告"
            />
          </div>
        </div>
        <div className={cn(styles.right)}>
          <Form
            form={form}
            name="form"
            autoComplete="off"
            colon={false}
            labelAlign="right"
            labelCol={{ span: 6 }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="检查结果"
                  name="positive"
                  rules={[{ required: true, message: '请选择检查结果' }]}
                >
                  <Select
                    placeholder="请选择检查结果"
                    options={inspectionResultOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="阳性等级"
                  name="positiveLevel"
                  rules={[{ required: true, message: '请输入阳性等级' }]}
                >
                  <Select
                    placeholder="请选择阳性等级"
                    options={positiveLevelResultOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="检查结论"
                  name="conclusion"
                  rules={[{ required: true, message: '请输入检查结论' }]}
                >
                  <TextArea placeholder="请输入检查结论" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType> noStyle>
                  <Form.Item
                    label="PDF内容区域"
                    className={cn([styles.splitLineTitle])}
                  >
                    <div className={cn([styles.splitLine])}></div>
                  </Form.Item>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="综合结论"
                  name="synthesisConclusion"
                  rules={[{ required: true, message: '请输入综合结论' }]}
                >
                  <Input placeholder="请输入综合结论" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="描述信息"
                  name="description"
                  rules={[{ required: true, message: '请输入描述信息' }]}
                  valuePropName="value" // 告诉 Form 如何绑定 ReactQuill 的值
                  getValueFromEvent={(content) => {
                    console.log('富文本内容', content)
                    return content
                  }} // 提取 onChange 的返回值
                >
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    style={{ height: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Drawer>
  )
})

export default AiReportAnalysis
