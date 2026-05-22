import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps
} from 'antd'
import cn from 'classnames'
import styles from './dataManagementNew.less'
import { organizationBusinessService } from '@/pages/organizationBusiness/services'
import { genderOptions, phoneNumberValidator } from '@/utils'
import { InboxOutlined } from '@ant-design/icons'
import { commonService } from '@/pages/common/services'
import { dataManagementService } from '@/pages/dataManagement/services'
import DayJS from 'dayjs'

const { RangePicker } = DatePicker
const { Dragger } = Upload

const { TextArea } = Input

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  gender?: string
  age?: string
  mobile?: string
  times?: string[]
  wearStartTime?: string
  wearEndTime?: string
  files?: string
  sn?: string
  organizationId?: string
  outerBusinessId?: string
  medicalHistory?: string
  symptoms?: string
  conclusion?: string
  remark?: string
}

const DataManagementNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [organizationBusinessOptions, setOrganizationBusinessOptions] =
    useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()
  let ecgDataOssIdRef = useRef({
    id: ''
  })

  const uploadProps: UploadProps = {
    name: 'files',
    onRemove: (file) => {
      setFileList([])
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])

      return false
    },
    fileList
  }

  useEffect(() => {
    if (isVisible) {
      getOrganizationList()
    }
  }, [isVisible])

  const getOrganizationList = async () => {
    const { code, data } = await commonService.getAllOrganizationsList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const getOrganizationBusinessList = async (id: string) => {
    const { code, data } = await organizationBusinessService.getList({
      organizationId: id
    })
    if (code === '200') {
      console.log('获取的机构业务类型数据', data)
      setOrganizationBusinessOptions(data.list)
    }
  }

  const handleUpload = async () => {
    try {
      const promises = fileList.map(async (file) => {
        const res = await commonService.getUploadUrl({
          originalName: file.name
        })
        console.log('获取文件上传链接', res)
        const { code, data } = res
        ecgDataOssIdRef.current = { id: data.id }

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

  const onChangeOrganization = (value: string) => {
    console.log('内容变化了', value)
    getOrganizationBusinessList(value)
    setOrganizationBusinessOptions([])
    form.resetFields(['outerBusinessId'])
  }

  const onOk = async () => {
    const values = await form.validateFields()
    setLoading(true)
    console.log('内容', values)

    try {
      await handleUpload()
      const data = await dataManagementService.add({
        ...values,
        wearStartTime: DayJS(values.times[0]).format('YYYY-MM-DD HH:mm:ss'),
        wearEndTime: DayJS(values.times[1]).format('YYYY-MM-DD HH:mm:ss'),
        ecgDataOssId: ecgDataOssIdRef.current.id
      })
      console.log('执行顺序')

      if (data.code === '200') {
        message.success('新增数据成功')

        setLoading(false)
        form.resetFields()

        handleOk?.()
      } else {
        message.error(data.msg)

        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const onCancel = () => {
    form.resetFields()
    setOrganizationBusinessOptions([])
    handleCancel?.()
    console.log('抽屉关闭了')
  }

  return (
    <Drawer
      className={cn(styles.dataManagementNew)}
      title="新增数据"
      open={isVisible}
      width={568}
      onClose={onCancel}
      footer={
        <div className={cn(['gDrawerFooter'])}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            loading={loading}
            style={{ marginLeft: 16 }}
            className={cn(['gMainButton'])}
            type="primary"
            onClick={onOk}
          >
            确认
          </Button>
        </div>
      }
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
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="性别"
              name="gender"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Radio.Group options={genderOptions} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="年龄"
              name="age"
              rules={[{ required: true, message: '请输入年龄' }]}
            >
              <InputNumber style={{ width: 120 }} placeholder="请输入年龄" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="手机号"
              name="mobile"
              rules={[
                { required: false, message: '请输入手机号' },
                {
                  validator: phoneNumberValidator
                }
              ]}
            >
              <Input placeholder="请输入手机号" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="佩戴开始时间"
              name="times"
              rules={[{ required: true, message: '请输入佩戴开始时间' }]}
            >
              <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="心电数据上传" required>
              <Form.Item<FieldType>
                name="files"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: '请上传文件' }]}
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
          <Col span={24}>
            <Form.Item<FieldType>
              label="体检ID"
              name="sn"
              rules={[{ required: false, message: '请输入体检ID' }]}
            >
              <Input placeholder="请输入体检ID" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="机构"
              name="organizationId"
              rules={[{ required: true, message: '请选择机构' }]}
            >
              <TreeSelect
                placeholder="请选择机构"
                treeData={organizationOptions}
                allowClear
                treeDefaultExpandAll
                onChange={onChangeOrganization}
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="机构业务类型"
              name="outerBusinessId"
              rules={[{ required: false, message: '请选择机构业务类型' }]}
            >
              <Select
                placeholder="请选择机构业务类型"
                options={organizationBusinessOptions}
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="既往病史"
              name="medicalHistory"
              rules={[{ required: false, message: '请输入既往病史' }]}
            >
              <TextArea placeholder="请输入既往病史" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="不适症状"
              name="symptoms"
              rules={[{ required: false, message: '请输入不适症状' }]}
            >
              <TextArea placeholder="请输入不适症状" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="检查过程记录"
              name="conclusion"
              rules={[{ required: false, message: '请输入检查过程记录' }]}
            >
              <TextArea placeholder="请输入检查过程记录" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="备注"
              name="remark"
              rules={[{ required: false, message: '请输入备注' }]}
            >
              <TextArea placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
})

export default DataManagementNew
