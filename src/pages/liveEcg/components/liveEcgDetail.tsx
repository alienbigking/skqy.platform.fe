import React, { memo, useEffect, useState } from 'react'
import { Button, Col, Drawer, Form, Input, message, Row } from 'antd'
import cn from 'classnames'
import styles from './liveEcgDetail.less'
import { filterEventsType, gender, isNullObject } from '@/utils'
import { liveActiveService } from '@/pages/liveActive/services'
import { HeartRate } from '@/components/heartRate'
import {
  EHeartRateMode,
  EHeartRateType
} from '@/components/heartRate/types/heartRate'
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
  username?: string
  age?: number
  genderText?: string
  afLoad?: string
  mobile?: string
  avgHr?: string
  rmssd?: string
  sdnn24?: string
  dc?: string
  symptom?: string
  conclusion?: string
  events?: string
}

const LiveEcgDetail: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [menuOptions, setMenuOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      console.log('每次获取的行数据', rowData)
      getDetail()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    // const { code, data } = await liveActiveService.getDetail(rowData.id)

    console.log('获取的实时活跃详情', rowData)
    handleDetailData(rowData)
  }

  const handleDetailData = (values: any) => {
    const genderText = gender(values?.content?.gender)

    let symptomStr = ''
    values?.content?.labels?.forEach((item: any, index: number) => {
      symptomStr +=
        item.name + (index < values?.content?.labels.length - 1 ? '、' : '')
    })

    let conclusionStr = ''
    values?.content?.summary?.forEach((item: any) => {
      conclusionStr += item.detail + item.short + '\n'
    })

    let eventsStr = ''
    values?.content?.metrics?.events?.forEach((item: any, index: number) => {
      eventsStr +=
        filterEventsType(Number(item.type)) +
        (index < values?.content?.metrics?.events.length - 1 ? '、' : '')
    })

    // 处理时间
    const createAt = values.timestamp
      ? DayJS(values.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
      : values.createAt

    form.setFieldsValue({
      ...values?.content,
      ...values?.content?.metrics,
      // createAt: DayJS(createAt * 1000).format('YYYY-MM-DD HH:mm:ss'),
      // createAt: values.createAt,
      createAt: createAt,
      genderText,
      conclusion: conclusionStr,
      events: eventsStr,
      symptom: symptomStr
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
    <Drawer
      title="实时心电详情"
      open={isVisible}
      rootClassName={cn(styles.drawer)}
      width="100%"
      onClose={onCancel}
      destroyOnClose={true}
      footer={
        <div className={cn(['gDrawerFooter'])}>
          <Button onClick={onCancel}>取消</Button>
          <Button
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
        labelCol={{ span: 8 }}
        variant="filled"
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item<FieldType>
              label="时间"
              name="createAt"
              rules={[{ required: false, message: '时间' }]}
            >
              <Input placeholder="时间" readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<FieldType>
              label="姓名"
              name="username"
              rules={[{ required: false, message: '姓名' }]}
            >
              <Input placeholder="姓名" readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<FieldType>
              label="年龄"
              name="age"
              rules={[{ required: false, message: '年龄' }]}
            >
              <Input placeholder="年龄" readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<FieldType>
              label="性别"
              name="genderText"
              rules={[{ required: false, message: '性别' }]}
            >
              <Input placeholder="性别" readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<FieldType>
              label="手机号码"
              name="mobile"
              rules={[{ required: false, message: '手机号码' }]}
            >
              <Input placeholder="手机号码" readOnly />
            </Form.Item>
          </Col>
          {/*<Col span={8}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="房颤负荷百分数"*/}
          {/*    name="afLoad"*/}
          {/*    rules={[{ required: false, message: '房颤负荷百分数' }]}*/}
          {/*  >*/}
          {/*    <Input placeholder="房颤负荷百分数" readOnly />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={8}>
            <Form.Item<FieldType>
              label="平均心率"
              name="avgHr"
              rules={[{ required: false, message: '平均心率' }]}
            >
              <Input placeholder="平均心率" readOnly />
            </Form.Item>
          </Col>
          {/*<Col span={8}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="心率紧张度RMSSD"*/}
          {/*    name="rmssd"*/}
          {/*    rules={[{ required: false, message: 'RMSSD' }]}*/}
          {/*  >*/}
          {/*    <Input placeholder="RMSSD" readOnly />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="心率活跃度SDNN24"*/}
          {/*    name="sdnn24"*/}
          {/*    rules={[{ required: false, message: 'SDNN24' }]}*/}
          {/*  >*/}
          {/*    <Input placeholder="SDNN24" readOnly />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="心率减速率DC"*/}
          {/*    name="dc"*/}
          {/*    rules={[{ required: false, message: 'dc' }]}*/}
          {/*  >*/}
          {/*    <Input placeholder="dc" readOnly />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={8}>
            <Form.Item<FieldType>
              label="病史"
              name="symptom"
              rules={[{ required: false, message: '病史' }]}
            >
              <TextArea rows={4} placeholder="病史" maxLength={6} readOnly />
            </Form.Item>
          </Col>
          {/*<Col span={8}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="结论"*/}
          {/*    name="conclusion"*/}
          {/*    rules={[{ required: false, message: '结论' }]}*/}
          {/*  >*/}
          {/*    <TextArea rows={4} placeholder="结论" maxLength={6} readOnly />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={8}>
            <Form.Item<FieldType>
              label="事件类型"
              name="events"
              rules={[{ required: false, message: '事件类型' }]}
            >
              <TextArea
                rows={4}
                placeholder="事件类型"
                maxLength={6}
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={cn(styles.ecg)}>
        <HeartRate
          isShowUserInfo={false}
          mode={EHeartRateMode.previewMode}
          type={EHeartRateType.thirtySecHeartRate}
          dataSource={rowData}
        />
      </div>
    </Drawer>
  )
})

export default LiveEcgDetail
