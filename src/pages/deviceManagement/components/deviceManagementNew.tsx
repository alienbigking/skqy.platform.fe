import React, { memo, useEffect, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space
} from 'antd'
import cn from 'classnames'
import styles from './deviceManagementNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { deviceManagementService } from '../services'
import { commonService } from '@/pages/common/services'
import { deviceTypeOptions } from '@/utils'
import Dayjs from 'dayjs'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  deviceType?: string
  productionDate?: string
  sns?: string
  hardwareVersion?: string
  firmwareVersion?: string
}

const { TextArea } = Input

const DeviceManagementNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

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

  const onBatchGeneration = () => {
    const values = form.getFieldsValue()
    console.log('输入的值', values)

    if (!values.productionDate) {
      message.error('请先选择生产日期')
      return
    }
    if (!values.deviceType) {
      message.error('请先选择设备类型')
      return
    }
    if (!values.snMin) {
      message.error('请先输入最小值')
      return
    }
    if (!values.snMax) {
      message.error('请先输入最大值')

      return
    }
    if (values.snMin > values.snMax) {
      message.error('最小值不能大于最大值')

      return
    }

    let manufacturLocation = '1' // 深圳
    let productYear = String(Dayjs(values.productionDate).year()).slice(-2)
    let month = String(Dayjs(values.productionDate).month() + 1).padStart(
      2,
      '0'
    ) // 月份加1，并补零
    let date = String(Dayjs(values.productionDate).date()).padStart(2, '0') // 日期补零

    let productCode
    switch (values.deviceType) {
      case 1:
        productCode = '010'
        break
      case 2:
        productCode = '020'
        break
      case 3:
        productCode = '030'
        break
      case 4:
        productCode = '041'
        break
      case 5:
        productCode = '021'
        break
    }

    // 定义最小值和最大值
    const minValue = values.snMin
    const maxValue = values.snMax

    // 生成数字范围数组
    const numbers = Array.from(
      { length: maxValue - minValue + 1 },
      (_, index) => index + minValue
    )

    // 格式化成4位长度的数字并输出
    const formattedNumbers = numbers.map((num) =>
      num.toString().padStart(4, '0')
    )

    let code = manufacturLocation + productYear + month + date + productCode
    const result = formattedNumbers.map((value) => {
      return code + value
    })

    form.setFieldsValue({
      sns: result
    })
    console.log('表单值', values, '结果', result)
  }

  const onOk = async () => {
    const values = await form.validateFields()
    let sns = []

    if (values && typeof values.sns === 'string') {
      if (values.sns.includes(',')) {
        sns = values.sns
          .split(',')
          .map((value: string) => value.trim().replace(/'/g, ''))
      } else {
        sns = [values.sns.replace(/'/g, '')]
      }
    } else if (Array.isArray(values.sns)) {
      sns = values.sns
    }

    console.log('内容', values)
    const data = await deviceManagementService.batchAdd({ ...values, sns: sns })

    if (data.code === '200') {
      message.success('新增设备成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.warning(data.msg)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.deviceManagementNew)}
      title="新增设备"
      open={isVisible}
      width={568}
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
        labelCol={{ span: 6 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="设备类型"
              name="deviceType"
              rules={[{ required: true, message: '请选择设备类型' }]}
            >
              <Select
                placeholder="请选择设备类型"
                options={deviceTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> label="sn码生成规则">
              <Space.Compact size="middle">
                <Form.Item
                  name="productionDate"
                  noStyle
                  style={{ marginBottom: 0 }}
                  rules={[{ required: false, message: '请输入生产日期' }]}
                >
                  <DatePicker
                    type="date"
                    placeholder="生产日期"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item
                  name="snMin"
                  noStyle
                  style={{ marginBottom: 0 }}
                  rules={[{ required: false, message: '请输入最小值' }]}
                >
                  <InputNumber placeholder="最小值" min={1} max={9998} />
                </Form.Item>
                <Form.Item
                  name="snMax"
                  noStyle
                  style={{ marginBottom: 0 }}
                  rules={[{ required: false, message: '请输入最大值' }]}
                >
                  <InputNumber placeholder="最大值" min={1} max={9999} />
                </Form.Item>
                <Button type="primary" onClick={onBatchGeneration}>
                  批量生成
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> label="sn码" required>
              <Form.Item
                name="sns"
                rules={[{ required: true, message: '请输入sn码' }]}
                noStyle
              >
                <TextArea rows={6} placeholder="请输入sn码" />
              </Form.Item>
              <span style={{ color: '#d4d4d4' }}>
                请使用英文逗号{'"' + ',' + '"'}隔开
              </span>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="硬件版本"
              name="hardwareVersion"
              rules={[{ required: false, message: '请输入硬件版本' }]}
            >
              <Input placeholder="请输入硬件版本" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="固件版本"
              name="firmwareVersion"
              rules={[{ required: false, message: '请输入固件版本' }]}
            >
              <Input placeholder="请输入固件版本" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default DeviceManagementNew
