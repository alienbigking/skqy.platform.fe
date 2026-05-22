import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps
} from 'antd'
import cn from 'classnames'
import styles from './productManagementNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { productManagementService } from '../services'
import {
  productTypeOptions,
  removeQueryParams,
  sourceProviderOptions
} from '@/utils'
import { productCategoryService } from '@/pages/productCategory/services'
import { InboxOutlined } from '@ant-design/icons'
import { commonService } from '@/pages/common/services'
import { productExternalRelevanceInfoOptions } from '@/utils/options'
import { EUrgencyType } from '@/pages/common/types/common'

const { Dragger } = Upload
const { TextArea } = Input

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  files: UploadFile[]
  productDetailFiles: UploadFile[]
  categoryId?: string
  name?: string
  price?: string
  status?: number
  shortDescription?: string
  description?: string
  sourceProvider?: number
  productIdentifier?: string
  productExternalRelevanceInfo?: any
  productType?: string
  urgencyType?: string
  dataDurationLimitMinutes?: string
  serviceContent?: string
  specification?: string
  parameter?: string
  productDetail?: string
}
const ProductManagementNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props

  const [checkedStatus, setCheckedStatus] = useState(false)
  const [categoryOption, setCategoryOption] = useState<any>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [productDetailFileList, setProductDetailFileList] = useState<
    UploadFile[]
  >([])
  const [checkedUrgencyType, setCheckedUrgencyType] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('')
  const [form] = Form.useForm()
  let fileOssIdRef = useRef({
    urls: [] as string[]
  })
  let productDetailImagesOssIdRef = useRef({
    urls: [] as string[]
  })

  useEffect(() => {
    if (isVisible) {
      getCategoryList()
    }
    return () => {
      console.log('清除了并置空')
      // setFileList([])
      // setCheckedStatus(false)
      // setCheckedUrgencyType(false)
      // setProductDetailFileList([])
      setLoading(false)
      fileOssIdRef.current = {
        urls: []
      }
      productDetailImagesOssIdRef.current = {
        urls: []
      }
    }
  }, [isVisible])

  const getCategoryList = async () => {
    const { code, data } = await productCategoryService.getList()
    console.log('获取的产品类别列表', data.list)
    if (code === '200') {
      setCategoryOption(data.list)
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单值', values)
    setLoading(true)
    await handleUpload()

    values.productExternalRelevanceInfo = {
      [values.externalField.externalFieldKey]:
        values.externalField.externalFieldValue
    }

    values.status = values.status ? 2 : 1
    values.urgencyType = values.urgencyType
      ? EUrgencyType.express
      : EUrgencyType.standard

    const productImages = fileOssIdRef.current.urls?.map((url: any) =>
      removeQueryParams(url)
    )
    const productDetailImages = productDetailImagesOssIdRef.current.urls?.map(
      (url: any) => removeQueryParams(url)
    )

    delete values.files
    delete values.productDetailFiles

    console.log('主图片数组', fileOssIdRef.current.urls)
    console.log('详情图片数组', productDetailImagesOssIdRef.current.urls)

    const data = await productManagementService.add({
      ...values,
      categoryId: values.categoryId.toString(),
      productImages: productImages,
      productDetailImages: productDetailImages,
      price: values.price * 100
    })

    if (data.code === '200') {
      message.success('新增商品成功')
      form.resetFields()
      handleOk?.()
      setLoading(false)
    } else {
      setLoading(false)
      fileOssIdRef.current.urls = []
      productDetailImagesOssIdRef.current.urls = []
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onChangeStatus = (state: boolean) => {
    console.log('上架状态', state)
    setCheckedStatus(state)
  }

  const onChangeUrgencyType = (state: boolean) => {
    setCheckedUrgencyType(state)
  }

  const onSelectProductType = () => {}

  const onSelectSourceProvider = () => {}

  const handleUpload = async () => {
    setLoading(true)

    try {
      const files = form.getFieldValue('files') || []
      const productDetailFiles = form.getFieldValue('productDetailFiles') || []

      const newMainFiles = files.filter((file: any) => file.originFileObj)

      const newDetailFiles = productDetailFiles.filter(
        (file: any) => file.originFileObj
      )

      console.log('新主图文件', newMainFiles)
      console.log('新详情图文件', newDetailFiles)

      await Promise.all([
        uploadFileList(newMainFiles, fileOssIdRef),
        uploadFileList(newDetailFiles, productDetailImagesOssIdRef)
      ])

      message.success('文件上传成功')
    } catch (error) {
      console.error('文件上传失败:', error)
      message.error('文件上传失败，请重新操作')
    } finally {
      setLoading(false)
    }
  }

  const uploadFileList = async (
    files: any[] = [],
    urlRef: React.MutableRefObject<{ urls: string[] }>
  ) => {
    if (!files.length) return []

    return Promise.all(
      files.map(async (file) => {
        const res = await commonService.getUploadUrl({
          originalName: file.name
        })

        const { code, data } = res
        if (code !== '200') {
          throw new Error('获取上传地址失败')
        }

        await commonService.aliyunUpload({
          url: data.url,
          file: file.originFileObj as File
        })

        await commonService.setPublicFile({ ossId: data.id })

        // ✅ 全流程成功后再记录
        urlRef.current.urls.push(data.url)

        return {
          url: data.url,
          ossId: data.id
        }
      })
    )
  }
  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const uploadProps: UploadProps = {
    name: 'files',
    listType: 'picture',
    multiple: true,
    onRemove: (file) => {
      fileOssIdRef.current.urls = fileOssIdRef.current.urls.filter(
        (url) => url !== file.url
      )
      console.log('商品主图删除的文件:', fileOssIdRef.current.urls)

      return true
    },
    beforeUpload: (file) => {
      return false
    }
  }

  const productDetailNormFile = (e: any) => {
    console.log('商品详情图上传事件:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const productDetailUploadProps: UploadProps = {
    name: 'productDetailFiles',
    listType: 'picture',
    multiple: true,
    onRemove: (file) => {
      console.log('商品详情图删除的文件:', file)

      productDetailImagesOssIdRef.current.urls =
        productDetailImagesOssIdRef.current.urls.filter(
          (url) => url !== file.url
        )
      return true
    },
    beforeUpload: (file) => {
      console.log('商品详情图上传的文件:', file)
      return false
    },
    fileList: productDetailFileList
  }
  const onSelectProductCategory = (value: string) => {
    const selectedCategory: any = categoryOption.find(
      (item: any) => item.id === value
    )
    setSelectedCategoryCode(selectedCategory?.code || '')
  }

  return (
    <Modal
      title="新增商品"
      open={isVisible}
      width={568}
      centered
      onOk={onOk}
      onCancel={onCancel}
      className={cn(styles.productManagementNew)}
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
        labelCol={{ span: 7 }}
        initialValues={{
          status: false,
          urgencyType: false
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="商品类别"
              name="categoryId"
              rules={[{ required: true, message: '请选择商品类别' }]}
            >
              <TreeSelect
                placeholder="请选择商品类别"
                treeData={categoryOption}
                allowClear
                treeDefaultExpandAll
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                onChange={onSelectProductCategory}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="商品来源提供者"
              name="sourceProvider"
              rules={[{ required: true, message: '请选择商品来源提供者' }]}
            >
              <Select
                onChange={onSelectSourceProvider}
                options={sourceProviderOptions}
                placeholder="请选择商品来源提供者"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="商品名称"
              name="name"
              rules={[{ required: true, message: '请输入商品名称' }]}
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="价格"
              name="price"
              rules={[{ required: true, message: '请输入商品价格' }]}
            >
              <InputNumber
                placeholder="请输入商品价格"
                style={{ width: '100%' }}
                min={0}
                addonAfter="元"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="商品类型"
              name="productType"
              rules={[{ required: true, message: '请选择商品类型' }]}
            >
              <Select
                onChange={onSelectProductType}
                options={productTypeOptions}
                placeholder="请选择商品类型"
                allowClear
              />
            </Form.Item>
          </Col>
          {selectedCategoryCode === 'product.category.physicalGoods' && (
            <>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="服务信息"
                  name="serviceContent"
                  rules={[{ required: true, message: '请输入服务信息' }]}
                >
                  <Input placeholder="请输入服务信息" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="规格"
                  name="specification"
                  rules={[{ required: true, message: '请输入规格' }]}
                >
                  <Input placeholder="请输入规格" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="参数"
                  name="parameter"
                  rules={[{ required: true, message: '请输入参数' }]}
                >
                  <Input placeholder="请输入参数" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="商品说明"
                  name="productDetail"
                  rules={[{ required: true, message: '请输入商品说明' }]}
                >
                  <TextArea rows={4} placeholder="请输入商品说明" />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24}>
            <Form.Item label="商品主图" required>
              <Form.Item<FieldType>
                name="files"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: '请上传商品主图' }]}
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
          {selectedCategoryCode === 'product.category.physicalGoods' && (
            <Col span={24}>
              <Form.Item label="商品详情图" required>
                <Form.Item<FieldType>
                  name="productDetailFiles"
                  valuePropName="fileList"
                  getValueFromEvent={productDetailNormFile}
                  rules={[{ required: true, message: '请上传商品详情图' }]}
                >
                  <Dragger {...productDetailUploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽文件到此处</p>
                  </Dragger>
                </Form.Item>
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item<FieldType>
              label="是否上架"
              name="status"
              valuePropName="checked"
              rules={[{ required: true, message: '是否上架' }]}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="是否加急"
              name="urgencyType"
              valuePropName="checked"
              rules={[{ required: true, message: '是否加急' }]}
            >
              <Switch />
            </Form.Item>
          </Col>
          {[
            'product.category.reportInterpretation',
            'product.category.digitalRightPackage',
            'product.category.dynamicAssessment',
            'product.category.healthAssessment'
          ].includes(selectedCategoryCode) && (
            <>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="数据时长最大限制"
                  name="dataDurationLimitMinutes"
                  rules={[
                    { required: false, message: '请输入数据时长最大限制' }
                  ]}
                >
                  <InputNumber
                    placeholder="请输入数据时长最大限制"
                    style={{ width: '100%' }}
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="商品唯一标识"
                  name="productIdentifier"
                  rules={[{ required: false, message: '请输入商品唯一标识' }]}
                >
                  <Input placeholder="请输入商品唯一标识" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="商品外部关联信息"
                  name="productExternalRelevanceInfo"
                  rules={[
                    { required: false, message: '请输入商品外部关联信息' }
                  ]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item
                      name={['externalField', 'externalFieldKey']}
                      noStyle
                      rules={[
                        { required: true, message: '请选择外部关联字段' }
                      ]}
                    >
                      <Select
                        placeholder="请选择关联字段"
                        options={productExternalRelevanceInfoOptions}
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item
                      name={['externalField', 'externalFieldValue']}
                      noStyle
                      rules={[
                        { required: true, message: '请输入关联字段内容' }
                      ]}
                    >
                      <Input
                        style={{ width: '100%' }}
                        placeholder="请输入关联字段内容"
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24}>
            <Form.Item<FieldType>
              label="简短描述"
              name="shortDescription"
              rules={[{ required: false, message: '请输入简短描述' }]}
            >
              <Input placeholder="请输入简短描述" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="描述"
              name="description"
              rules={[{ required: false, message: '请输入简短描述' }]}
            >
              <Input placeholder="请输入简短描述" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default ProductManagementNew
