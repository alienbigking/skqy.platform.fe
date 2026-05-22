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
import styles from './reportAnalysisDetail.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import {
  inspectionResultOptions,
  isNullObject,
  positiveLevelResultOptions
} from '@/utils'
import { InboxOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
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

const ReportAnalysisEdit: React.FC<Props> = memo((props) => {
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
    disabled: true,
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
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('file', file as RcFile)
    })
    // const { data } = await commonService.upload({ file: formData })
    // console.log('文件上传成功', data)
    // fileOssIdRef.current = data
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

    delete values.files
    const data = await reportAnalysisService.uploadDynamicAnalysis({
      ...values,
      id: rowData.id,
      ossId: fileOssIdRef.current?.id
    })

    if (data.code === '200') {
      message.success('编辑报告分析成功')
      setLoading(false)
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
      className={cn(styles.reportAnalysisDetail)}
      title="查看结论"
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
                disabled
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
                disabled
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
              <TextArea disabled placeholder="请输入检查结论" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="心电数据上传">
              <Form.Item<FieldType>
                name="files"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: false, message: '请上传文件' }]}
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

export default ReportAnalysisEdit
