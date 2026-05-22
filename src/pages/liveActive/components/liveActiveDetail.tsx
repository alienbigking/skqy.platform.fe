import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row } from 'antd'
import cn from 'classnames'
import styles from './liveActiveDetail.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { gender, isNullObject } from '@/utils'
import { liveActiveService } from '@/pages/liveActive/services'
import DayJS from 'dayjs'

const { TextArea } = Input

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  createAt?: string
  name?: string
  age?: number
  genderText?: string
  afLoad?: string
  mobile?: string
  avgHr?: string
  rmssd?: string
  sdnn24?: string
  dc?: string
  conclusion?: string
}

const LiveActiveDetail: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [menuOptions, setMenuOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    // const { code, data } = await liveActiveService.getDetail(rowData.id)

    console.log('获取的实时活跃详情', rowData)
    handleDetailData(rowData)
  }

  const handleDetailData = (values: any) => {
    const genderText = gender(values.gender)

    let str = ''
    values.summary.forEach((item: any) => {
      str += item.detail + item.short + '\n'
    })

    form.setFieldsValue({
      ...values,
      ...values.metrics,
      createAt: DayJS(values.createAt * 1000).format('YYYY-MM-DD HH:mm:ss'),
      genderText,
      conclusion: str
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await liveActiveService.update(rowData.id, { ...values })
    if (data.code === '200') {
      message.success('编辑成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.liveActiveDetail)}
      title="实时活跃详情"
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
              label="时间"
              name="createAt"
              rules={[{ required: false, message: '时间' }]}
            >
              <Input placeholder="时间" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="姓名"
              name="name"
              rules={[{ required: false, message: '姓名' }]}
            >
              <Input placeholder="姓名" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="年龄"
              name="age"
              rules={[{ required: false, message: '年龄' }]}
            >
              <Input placeholder="年龄" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="性别"
              name="genderText"
              rules={[{ required: false, message: '性别' }]}
            >
              <Input placeholder="性别" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="手机号码"
              name="mobile"
              rules={[{ required: false, message: '手机号码' }]}
            >
              <Input placeholder="手机号码" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="房颤负荷百分数"
              name="afLoad"
              rules={[{ required: false, message: '房颤负荷百分数' }]}
            >
              <Input placeholder="房颤负荷百分数" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="平均心率"
              name="avgHr"
              rules={[{ required: false, message: '平均心率' }]}
            >
              <Input placeholder="平均心率" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="心率紧张度RMSSD"
              name="rmssd"
              rules={[{ required: false, message: 'RMSSD' }]}
            >
              <Input placeholder="RMSSD" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="心率活跃度SDNN24"
              name="sdnn24"
              rules={[{ required: false, message: 'SDNN24' }]}
            >
              <Input placeholder="SDNN24" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="心率减速率DC"
              name="dc"
              rules={[{ required: false, message: 'dc' }]}
            >
              <Input placeholder="dc" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="结论"
              name="conclusion"
              rules={[{ required: false, message: '结论' }]}
            >
              <TextArea rows={4} placeholder="结论" maxLength={6} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default LiveActiveDetail
