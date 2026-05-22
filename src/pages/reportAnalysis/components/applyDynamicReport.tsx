import React, { memo, useEffect, useState } from 'react'
import { Col, Empty, Form, message, Modal, Radio, Row } from 'antd'
import cn from 'classnames'
import styles from './applyDynamicReport.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { reportAnalysisService } from '@/pages/reportAnalysis/services'

interface Props {
  type?: number
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  count?: number
  type?: string
  reportType?: string
}

const ApplyDynamicReport: React.FC<Props> = memo((props) => {
  const { isVisible = false, type = 1, rowData, handleOk, handleCancel } = props
  const [countValue, setCountValue] = useState(1)
  const [productList, setProductList] = useState<any>([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      console.log('状态值', isVisible)
      getOrganizationProductList()
      form.setFieldsValue({
        count: 1
      })
    }
  }, [isVisible])

  useEffect(() => {
    if (productList?.length) {
      form.setFieldsValue({
        reportType: productList[0]?.product.id
      })
    }
  }, [productList])

  const getOrganizationProductList = async () => {
    const { code, data } =
      await reportAnalysisService.getAllOrganizationProduct({
        organizationId: rowData.organizationId
      })
    if (code === '200') {
      setProductList(data)
      console.log('获取的产品列表', data)
    }
  }

  const onOk = async () => {
    if (!productList?.length) {
      message.warning('暂未配置报告，无法申请')
      return
    }

    const values = await form.validateFields()

    console.log('内容', values)
    const { code, data, msg } =
      await reportAnalysisService.applyIssuanceNlDynamicReport({
        id: rowData.id,
        productId: values.reportType
      })

    if (code === '200') {
      message.success('申请出具动态报告成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(msg)
    }
  }

  const onCancel = () => {
    console.log('触发关闭了')
    form.resetFields()
    handleCancel?.()
  }

  const onChangeReportType = (e: any) => {
    console.log('radio checked', e.target.value)
    setCountValue(e.target.value)
  }

  return (
    <Modal
      className={cn(styles.applyDynamicReport)}
      title="申请出具动态报告"
      open={isVisible}
      centered
      onOk={onOk}
      onCancel={onCancel}
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
            onClick: onOk
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
        labelCol={{ span: 4 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            {productList?.length > 0 ? (
              <Form.Item<FieldType>
                name="reportType"
                label="报告类型"
                rules={[{ required: true, message: '请选择报告类型' }]}
              >
                <Radio.Group
                  block
                  options={productList.map((item: any) => ({
                    label: item?.product.name,
                    value: item?.product.id
                  }))}
                  onChange={onChangeReportType}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
            ) : (
              <Form.Item>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂未配置报告"
                />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default ApplyDynamicReport
