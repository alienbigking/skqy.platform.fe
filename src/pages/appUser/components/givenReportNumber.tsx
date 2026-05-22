import React, { memo, useEffect, useState } from 'react'
import { Col, Form, InputNumber, message, Modal, Radio, Row, Tag } from 'antd'
import cn from 'classnames'
import styles from './givenReportNumber.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { appUserService } from '../services'
import { productManagementService } from '@/pages/productManagement/services'

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

const GivenReportNumber: React.FC<Props> = memo((props) => {
  const { isVisible = false, type = 1, rowData, handleOk, handleCancel } = props
  const [countValue, setCountValue] = useState(1)
  const [productList, setProductList] = useState<any>([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      console.log('状态值', isVisible)
      getProductList()
      form.setFieldsValue({
        count: 1
      })
    }
  }, [isVisible])

  useEffect(() => {
    if (productList?.length) {
      form.setFieldsValue({
        reportType: productList[0].id
      })
    }
  }, [productList])

  const getProductList = async () => {
    const { code, data } = await productManagementService.getList({
      productIdentifiers: [
        'com.innomedi.ylj.byDynamicReportServiceNumber',
        'com.innomedi.ylj.nl1hDynamicReportServiceNumber',
        'com.innomedi.ylj.nl24hDynamicReportServiceNumber',
        'com.innomedi.ylj.nl48hDynamicReportServiceNumber',
        'com.innomedi.ylj.nl72hDynamicReportServiceNumber'
      ].toString()
    })
    if (code === '200') {
      setProductList(data?.list)
      console.log('获取的产品列表', data.list)
    }
  }
  const titleNode = () => {
    return (
      <div>
        <span>赠送报告</span>
        <span
          style={{ color: '#d8d8d8', marginLeft: '8px', marginRight: '8px' }}
        >
          给
        </span>
        <span style={{ color: '#007AFF' }}>{rowData.nickname}</span>
      </div>
    )
  }
  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    const data = await appUserService.givenAiReportNumber({
      id: rowData.id,
      type,
      productId: values.reportType,
      ...values
    })

    if (data.code === '200') {
      message.success(
        type === 1 ? '赠送AI报告次数成功' : '赠送动态报告次数成功'
      )
      form.resetFields()
      handleOk?.()
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
      className={cn(styles.givenReportNumber)}
      title={titleNode()}
      open={isVisible}
      width={1200}
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
            <Form.Item<FieldType> noStyle>
              <Form.Item label="赠送报告类别">
                {type === 1 ? (
                  <Tag color="blue">AI报告</Tag>
                ) : (
                  <Tag color="green">动态报告</Tag>
                )}
              </Form.Item>
            </Form.Item>
          </Col>
          {type === 2 && (
            <Col span={24}>
              <Form.Item<FieldType> name="reportType" label="报告类型">
                <Radio.Group
                  block
                  options={productList.map((item: any) => ({
                    label: item.name,
                    value: item.id // 付费商品
                  }))}
                  onChange={onChangeReportType}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item<FieldType>
              label="赠送次数"
              name="count"
              rules={[{ required: false, message: '请输入赠送次数' }]}
            >
              <InputNumber min={1} value={countValue} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default GivenReportNumber
