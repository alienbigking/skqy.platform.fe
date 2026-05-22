import React, { memo, useEffect, useRef, useState } from 'react'
import { Button, Form, message } from 'antd'
import cn from 'classnames'
import styles from './aiReportAutoGeneration.less'
import { commonService } from '@/pages/common/services'
import { pdfjs } from 'react-pdf'
import { PDFDocument } from 'pdf-lib'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import DayJS from 'dayjs'
import { getUrlParams, isNullObject, storage } from '@/utils'
import { aiReportAutoGenerationService } from '@/pages/aiReportAutoGeneration/services'
import { dataManagementService } from '@/pages/dataManagement/services'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
const cmaps = `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`

interface Props {
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

const AiReportAutoGeneration: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props

  const [loading, setLoading] = useState(false)
  const [originalPdfArrayBuffer, setOriginalPdfArrayBuffer] = useState<Blob>() // 当前 PDF Blob
  const [updatedPdfBlob, setUpdatedPdfBlob] = useState<Blob>() // 更新后的 PDF Blob
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [isPreView, setIsPreView] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [uploadState, setUploadState] = useState(0)
  const [innerHTMLRemark, setInnerHTMLRemark] = useState<string>('')
  const [synthesisConclusion, setSynthesisConclusion] = useState('')

  const [form] = Form.useForm()
  let fileOssIdRef = useRef({
    id: ''
  })
  const iframePDFRef = useRef<HTMLIFrameElement | null>(null)
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
    getDetail()

    return () => {
      console.log('清空了')
      handleClear()
    }
  }, [])

  useEffect(() => {
    if (iframePDFRef.current && pdfBlobUrl) {
      iframePDFRef.current.src = pdfBlobUrl // 设置 iframe src
      console.log('设置iframe src 值', iframePDFRef.current.src)
    }
  }, [pdfBlobUrl])

  useEffect(() => {
    if (updatedPdfBlob) {
      console.log('生成新的PDF文件后开始上传')
      handleUpload()
    }
  }, [updatedPdfBlob])

  useEffect(() => {
    if (!isNullObject(detail)) {
      console.log('获取的数据详情', detail)
      downloadAndPreviewPdf()
    }
  }, [detail])

  const getDetail = async () => {
    const params = getUrlParams()
    storage.setSession('token', params.token)
    console.log('获取的token', storage.getSession('token'))

    const { code, data } = await dataManagementService.getDetail(params.id)
    if (code === '200') {
      setDetail(data)
    }
  }

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
    console.log('下载文件时的详情数据', detail)
    const fileUrl = await getDownloadURL(detail)
    const arrayBuffer = await commonService.download(fileUrl)
    setOriginalPdfArrayBuffer(arrayBuffer)

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
    // 将 Blob 转换为临时 URL
    const pdfBlobUrl = URL.createObjectURL(blob)
    setPdfBlobUrl(pdfBlobUrl)
  }

  const onOk = async () => {
    console.log('内容字段')

    appendPageToPdf()
    setLoading(true)
  }

  const handleUpload = async () => {
    try {
      await handleUploadFile()
      const data = await aiReportAutoGenerationService.upload({
        id: detail.id,
        type: 3, // 乐普 AI报告
        ossId: fileOssIdRef.current?.id
      })

      if (data.code === '200') {
        setLoading(false)
        message.success('AI报告上传成功')
        setUploadState(1)
        // handleClear()
      } else {
        message.error(data.msg)
        setUploadState(0)
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    } finally {
      // setFileIsUploadSuccess(false) // 重置标志位
    }
  }
  const handleUploadFile = async () => {
    const file = new File([updatedPdfBlob as Blob], detail.name + '.pdf')
    const pdfBlobUrl = URL.createObjectURL(updatedPdfBlob as Blob)
    console.log('上传处理上传的文件地址及名称', pdfBlobUrl, file)

    try {
      const res = await commonService.getUploadUrl({
        originalName: file.name
      })
      console.log('获取阿里云文件上传链接', res)
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
    if (!originalPdfArrayBuffer) {
      return
    }

    // 将 HTML 转为 PDF 并获取字节数据
    const newPdfBytes = await handleHtmlToPDF()
    if (!newPdfBytes) {
      console.error('HTML 转 PDF 失败')
      return
    }

    // 使用 pdf-lib 加载现有 PDF
    const arrayBuffer = await originalPdfArrayBuffer.arrayBuffer()
    // const clonedArrayBuffer = clone(arrayBuffer) // 克隆
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    const newPdfDoc = await PDFDocument.load(newPdfBytes)

    // 将所有页面从新 PDF 合并到现有 PDF
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

    console.log('生成了新的PDF文件', pdfBlobUrl)
  }

  const handleHtmlToPDF = async () => {
    const canvas = await html2canvas(htmlRef.current as HTMLElement, {
      scale: 2,
      allowTaint: true
    })

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

    const pdfBytes = PDF.output('arraybuffer')
    return new Uint8Array(pdfBytes)
  }

  const handleClear = () => {
    setOriginalPdfArrayBuffer(undefined)
    setUpdatedPdfBlob(undefined)
    setPdfBlobUrl(null)
    setSynthesisConclusion('')
    setInnerHTMLRemark('')
    iframePDFRef!.current!.src = ''
  }

  return (
    <div className={cn(styles.aiReportAutoGeneration)}>
      <div className={cn(styles.main)}>
        <div className={cn(styles.left)}>
          <div className={cn(styles.pdfConclusion)} ref={htmlRef}>
            <div className={cn(styles.main)}>
              <div className={cn(styles.content)}>
                {/*医师解读*/}
                {/*<div className={cn(styles.physician)}>*/}
                {/*  <div className={cn(styles.physicianContent)}>*/}
                {/*    <div className={cn(styles.physicianHeaderInfo)}>*/}
                {/*      <img*/}
                {/*        alt="乐心平江logo"*/}
                {/*        src={loginImageURl}*/}
                {/*        className={cn([styles.logoImage])}*/}
                {/*      />*/}
                {/*      <span className={cn(styles.time)}>*/}
                {/*        记录时间：*/}
                {/*        {DayJS(detail?.createAt).format(*/}
                {/*          'YYYY年MM月DD日 HH时mm分ss秒'*/}
                {/*        )}*/}
                {/*      </span>*/}
                {/*    </div>*/}
                {/*    <div className={cn([styles.physicianValueInfo])}>*/}
                {/*      <div className={cn([styles.title])}>综合结论</div>*/}
                {/*      <div className={cn([styles.value])}>*/}
                {/*        {synthesisConclusion}*/}
                {/*      </div>*/}
                {/*      <div className={cn([styles.line])}></div>*/}
                {/*      <div*/}
                {/*        className={cn([styles.remark])}*/}
                {/*        dangerouslySetInnerHTML={{ __html: innerHTMLRemark }}*/}
                {/*      />*/}
                {/*    </div>*/}
                {/*  </div>*/}

                {/*  <div className={cn([styles.physicianFooter])}>*/}
                {/*        <div className={cn(styles.signature)}>*/}
                {/*          <span className={cn(styles.signatureTitle)}>*/}
                {/*            医生签名:_________________*/}
                {/*          </span>*/}
                {/*        </div>*/}
                {/*        <div className={cn([styles.address])}>*/}
                {/*          <span className={cn([styles.zhAddress])}>*/}
                {/*            广东省深圳市宝安区西乡街道大铲湾蓝色未来科技园二期2栋3层*/}
                {/*          </span>*/}
                {/*          <span className={cn([styles.enAddress])}>*/}
                {/*            {`3F, Building 2, Dachan Bay Blue Future Science and Technology*/}
                {/*    Park, Xixiang Street,Bao'an District,Shenzhen, Guangdong*/}
                {/*    Province`}*/}
                {/*          </span>*/}
                {/*        </div>*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/*知识解读*/}
                <div className={cn(styles.knowledgeInterpretation)}>
                  <div className={cn(styles.headerInfo)}>
                    <span className={cn(styles.time)}>
                      记录时间：
                      {DayJS(detail?.createAt).format(
                        'YYYY年MM月DD日 HH时mm分ss秒'
                      )}
                    </span>
                  </div>
                  <div className={cn([styles.titleInfo])}>
                    <div className={cn([styles.title])}>解读及建议</div>
                    <div className={cn([styles.line])}></div>
                  </div>
                  <div className={cn([styles.contentInfo])}>
                    <div className={cn([styles.remark])}>
                      <div className={cn([styles.remarkContent])}>
                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>临床表现</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、SONM低：心里情绪压力可能对身体产生了负面影响，身体对环境的适应能力差，暗示严重健康损害。
                            </p>
                            <p>
                              2、SDANW低：心脏神经调节能力降低，交感神经张力过强，心脏功能缺陷。
                            </p>
                            <p>
                              3、室性早搏：心脏跳动不规则，提前跳动，由心室引起。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>症状说明</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、SDNN
                              是心率变异性重要指标，正常范围：102-180ms，SDNN
                              值越小表示交感神经活性增强，预測心脏风险发生率高，心率变异性降低表明您的心里情绪压力可能对身体产生了负面影响，身体对环境的适应能力差，暗示严重健康损害；当＜50ms时，预警极大可能发生心脏猝死；建议明确病因，保持情绪稳定，避免疲劳、熬夜。
                            </p>
                            <p>
                              2、SOANW
                              是心率变异性重要指标，正常范围：92-162ms，SDANN值降低提示交感神经活性增强，预测心脏性猝死和心律失常事件发生率高。；建议明确病因，保持情绪稳定，避免疲劳、熬夜。
                            </p>
                            <p>
                              3、室性早搏是指心室的提前跳动，是常见的良性心律失常：部分患者会有心择，心慌，心脏“停跷感”、胸闷、头晕、乏力等症状；：冠心病，心肌病，高血压性心脏病，心肌炎，风湿性心脏病以及各种原因造成的心力衰竭等都可引起室性早搏；室早造成的不适感会影响生活质量；建议就医，明确病因，积极治疗原发病，保持作息规律，保证充足睡眠，避免劳累、熬夜，避免饮浓茶咖啡等。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>可能关联的疾病</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、冠心病、糖尿病、高血压、严重心律失常、心脏疲劳、心脏神经调解能力下降。
                            </p>
                            <p>
                              2、心肌病、高血压性心脏病、心肌炎、风湿性心脏病、心力衰竭、心绞痛、心肌缺血。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>后继危害</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、SDNN
                              低：长期较低与同类人群相比可能导致猝死事件发生概率升高。
                            </p>
                            <p>
                              2、SDANN
                              低：长期较低与同类人群相比可能导致心力衰竭发生概率升高。
                            </p>
                            <p>
                              3、室性早搏：影响生活质量，不干预可能引发严重心脏病。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>产生的治疗及费用</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>1、一般治疗</p>
                            <p>
                              改变生活方式：保持良好作息习惯。控制基础疾病：积极治疗高血压、冠心病、糖尿病。饮食调理：注意饮食均衡，少食油腻、辛辣、刺激性食物，戒烟限酒。
                            </p>

                            <p>2、 药物治疗（200-600元/月）</p>
                            <p>在医生指导下服用B受体阻滞剂、抗心律失常药物。</p>

                            <p>3、手术治疗（2万-10万）</p>
                            <p>
                              查明病因后治疗原发性疾病，如：高血压、冠心病、糖尿病等。
                            </p>

                            <p>4、室性旱搏治疗</p>
                            <p>
                              室性期前收缩会导致患者出现心律失常、心力衰退、焦虑、紧张。可以在医生确认及指导下治疗。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>医生建议</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>1、SDNN低：及时就医，查明病因，干预治疗。</p>
                            <p>2、SDANN低：及时就医，查明病因，干预治疗。</p>
                            <p>
                              3、室性早搏：改变不良生活习惯，少饮浓咖啡、浓茶。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/*常见问题*/}
                <div className={cn([styles.commonProblem])}>
                  <div className={cn(styles.headerInfo)}>
                    <span className={cn(styles.time)}>
                      记录时间：
                      {DayJS(detail?.createAt).format(
                        'YYYY年MM月DD日 HH时mm分ss秒'
                      )}
                    </span>
                  </div>
                  <div className={cn([styles.titleInfo])}>
                    <div className={cn([styles.title])}>解读及建议</div>
                    <div className={cn([styles.line])}></div>
                  </div>

                  <div className={cn([styles.contentInfo])}>
                    <div className={cn([styles.remark])}>
                      <div className={cn([styles.remarkContent])}>
                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>窦性心律</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、窦性心律是指由窦房结发出激动所形成的心律，是正常人的正常心率表现。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>室性早搏</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、可见于结构性或无结构性心脏病者，如冠心病、心肌病、瓣膜性心脏、二尖瓣脱垂，包括休息不好、劳累、压力大、精神紧张、熬夜、吸烟、饮酒等不良的生活方式其他药物中毒、电解质紊乱等。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>房性早搏</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、频发房性早搏可见于非器质性状态和器质性疾病。非器质性状态包括休息不好、劳累、压力大、精神紧张、熬夜、吸烟、饮酒等不良的生活方式。器质性疾病常见于二尖瓣病变，甲状腺功能亢进或冠心病、药物影响等。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>心房颤动</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、心房颤动常见于器质性心脏病，如冠心病、风湿性心脏瓣膜病心肌病等、先心病以及高血压、甲状腺功能亢进、预计综合征等其他基础疾病。此外，还有部分房颤原因不明，可在情绪激动、外科手术、运动或大量饮酒时发生。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>长R-R间歇及停搏</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、心电图长R-R间歇及停搏指的是在心电图上，两次连续的规律性心跳之间存在较长的时间间隔。多由心脏传导阻滞、心肌缺血、甲状腺功能抗进及其他药物因素所导致。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>心律失常的临床症状及危害</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、常见症状包括心悸、胸闷、乏力、头晕、呼吸困难、胸痛、此外，心律失常还可能伴随一些其他症状，如出汗、面色苍白、黑蒙（短暂性视力丧失）、胃肠道症状（如腹胀、腹痛、腹泻、呕吐等）。这些症状可能出现在心律失常发作时，特别是伴有低血压或休克时。
                              严重的心律失常对人体的危险性较大，应积极干预及治疗，防止及杜绝晕厥、心功能减退及恶性心血管事件的发生。
                            </p>
                          </div>
                        </div>

                        <div className={cn([styles.item])}>
                          <p className={cn([styles.itemTitle])}>
                            <strong>心律失常的治疗</strong>
                          </p>
                          <div className={cn([styles.itemValue])}>
                            <p>
                              1、一般治疗：得了心律失常，饮食上应注意避免进食有刺激性的食物，如酒、浓茶、咖啡等。因为这些食物可使心跳增快，可以诱发各类快速型的心律失常。对于引起心律失常的基础心脏病而言，也应根据心脏病的特点，注意饮食，如冠心病应低脂饮食，而糖尿病患者应低糖或无糖饮食等。
                            </p>
                            <p>
                              2、药物治疗：是心律失常最常用的治疗方法，对快速型和缓慢型心律失常，均有可选择，一般治疗费用约200-600元/月。
                            </p>
                            <p>
                              3、非药物治疗：包括起搏器治疗，电的治疗，消融治疗，手术治疗和特殊手法的治疗。起搏器治疗主要适用于缓慢型心律失常，而其他类型的非药物治疗主要适用于快速型心律失常。治理费用一般在2w-10w不等。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
          {/*<Form*/}
          {/*  form={form}*/}
          {/*  name="form"*/}
          {/*  autoComplete="off"*/}
          {/*  colon={false}*/}
          {/*  labelAlign="right"*/}
          {/*  labelCol={{ span: 6 }}*/}
          {/*>*/}
          {/*  <Row gutter={24}>*/}
          {/*    <Col span={24}>*/}
          {/*      <Form.Item<FieldType> noStyle>*/}
          {/*        <Form.Item*/}
          {/*          label="PDF内容区域"*/}
          {/*          className={cn([styles.splitLineTitle])}*/}
          {/*        >*/}
          {/*          <div className={cn([styles.splitLine])}></div>*/}
          {/*        </Form.Item>*/}
          {/*      </Form.Item>*/}
          {/*    </Col>*/}
          {/*    <Col span={24}>*/}
          {/*      <Form.Item<FieldType>*/}
          {/*        label="综合结论"*/}
          {/*        name="synthesisConclusion"*/}
          {/*        rules={[{ required: true, message: '请输入综合结论' }]}*/}
          {/*      >*/}
          {/*        <Input placeholder="请输入综合结论" />*/}
          {/*      </Form.Item>*/}
          {/*    </Col>*/}
          {/*    <Col span={24}>*/}
          {/*      <Form.Item<FieldType>*/}
          {/*        label="描述信息"*/}
          {/*        name="description"*/}
          {/*        rules={[{ required: true, message: '请输入描述信息' }]}*/}
          {/*        valuePropName="value" // 告诉 Form 如何绑定 ReactQuill 的值*/}
          {/*        getValueFromEvent={(content) => {*/}
          {/*          console.log('富文本内容', content)*/}
          {/*          return content*/}
          {/*        }} // 提取 onChange 的返回值*/}
          {/*      >*/}
          {/*        <ReactQuill*/}
          {/*          theme="snow"*/}
          {/*          modules={modules}*/}
          {/*          formats={formats}*/}
          {/*          style={{ height: 200 }}*/}
          {/*        />*/}
          {/*      </Form.Item>*/}
          {/*    </Col>*/}
          {/*  </Row>*/}
          {/*</Form>*/}
        </div>
      </div>
      <div className={cn([styles.actions])}>
        {/*<Button style={{ marginLeft: 16 }} onClick={onPreview}>*/}
        {/*  预览*/}
        {/*</Button>*/}
        <Button
          id="aiReportAutoGenerationBtn"
          data-status={uploadState}
          loading={loading}
          style={{ marginLeft: 16 }}
          className={cn(['gMainButton'])}
          type="primary"
          onClick={onOk}
        >
          提交
        </Button>
      </div>
    </div>
  )
})

export default AiReportAutoGeneration
