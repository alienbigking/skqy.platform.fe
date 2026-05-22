import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps
} from 'antd'
import cn from 'classnames'
import styles from './submitReportAnalysis.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import {
  inspectionResultOptions,
  isNullObject,
  positiveLevelResultOptions
} from '@/utils'
import { InboxOutlined } from '@ant-design/icons'
import { commonService } from '@/pages/common/services'
import { reportAnalysisService } from '@/pages/reportAnalysis/services'

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
  files?: string
}

const SubmitReportAnalysis: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  let fileOssIdRef = useRef({
    id: ''
  })

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { code, data } = await reportAnalysisService.getDetail(rowData.id)
    console.log('获取的报告分析详情', data)
    if (code === '200') {
      // handleEditData(data)
    }
  }

  const uploadProps: UploadProps = {
    name: 'files',
    accept: '.pdf',
    onRemove: (file) => {
      setFileList([])
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])

      return false
    },
    fileList
  }

  const handleUpload = async () => {
    try {
      const promises = fileList.map(async (file) => {
        const res = await commonService.getUploadUrl({
          originalName: file.name
        })
        console.log('获取文件上传链接', res)
        const { code, data } = res
        fileOssIdRef.current = { id: data.id }

        if (code === '200') {
          await commonService.aliyunUpload({
            url: data.url,
            file: file as unknown as File
          })
          console.log('已上传到阿里云CDN服务器')
        }
      })

      await Promise.all(promises)
    } catch (error) {
      // 处理任何可能的错误
      console.error('文件上传失败:', error)
      message.error('文件上传失败，请重新操作')
    }
  }

  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const handleEditData = (values: any) => {
    const organizationIds = values?.organizations?.map((item: any) => item.id)

    form.setFieldsValue({
      ...rowData,
      organizationIds
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    setLoading(true)
    await handleUpload()
    console.log('异步结束')
    delete values.files
    const data = await reportAnalysisService.uploadDynamicAnalysis({
      ...values,
      id: rowData.id,
      ossId: fileOssIdRef.current?.id
    })

    if (data.code === '200') {
      message.success('提交结论成功')
      setLoading(false)
      setFileList([])
      form.resetFields()
      handleOk?.()
    } else {
      setLoading(false)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.submitReportAnalysis)}
      title="提交动态报告"
      open={isVisible}
      width={568}
      onOk={onOk}
      onCancel={onCancel}
      centered
      footer={[
        <AdvancedButton
          key="cancel"
          title="取消"
          defaultProps={{
            onClick: onCancel
          }}
        />,
        <AdvancedButton
          key="confirm"
          type={EType.general}
          title="确认"
          defaultProps={{
            onClick: onOk,
            loading: loading
          }}
        />
      ]}
    >
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
            <Form.Item label="动态报告上传">
              <Form.Item<FieldType>
                name="files"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: false, message: '请上传动态报告' }]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此处</p>
                </Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default SubmitReportAnalysis
