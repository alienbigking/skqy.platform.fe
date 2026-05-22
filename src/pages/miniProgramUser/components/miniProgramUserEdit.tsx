import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  TreeSelect
} from 'antd'
import cn from 'classnames'
import styles from './miniProgramUserEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { commonService } from '@/pages/common/services'
import { genderOptions, isNullObject } from '@/utils'
import { miniProgramUserService } from '@/pages/miniProgramUser/services'
import DayJS from 'dayjs'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
  rowData?: any
}

type FieldType = {
  organizationId?: string
  username?: string
  nickname?: string
  birthDate?: number
  gender?: string
  mobile?: string
  height?: number
  weight?: number
  sn?: string
  boxSn?: string
}
const MiniProgramUserEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getOrganizationList()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { code, data } = await miniProgramUserService.getUserInfo({
      id: rowData.id
    })
    console.log('获取的后台手动录入的用户详情', data)
    if (code === '200') {
      handleEditData(data)
    }
  }
  const getOrganizationList = async () => {
    const { code, data } = await commonService.getAllOrganizationsList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const handleEditData = (values: any) => {
    console.log('编辑', values)
    form.setFieldsValue({
      ...values,
      birthDate: DayJS(values?.birthDate),
      sn: values?.sn,
      boxSn: values?.boxSn
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    values.birthDate = DayJS(values?.birthDate).format('YYYY-MM-DD')
    const { code, data, msg } = await miniProgramUserService.update({
      ...values,
      id: rowData.id
    })

    if (code === '200') {
      message.success('编辑用户成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(msg)
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  return (
    <Modal
      className={cn(styles.miniProgramUserEdit)}
      title="编辑用户"
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
              label="机构"
              name="organizationId"
              rules={[{ required: true, message: '请选择机构' }]}
            >
              <TreeSelect
                disabled
                placeholder="请选择机构"
                treeData={organizationOptions}
                allowClear
                treeDefaultExpandAll
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="姓名"
              name="username"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="年龄"
              name="birthDate"
              rules={[{ required: true, message: '请输入年龄' }]}
            >
              {/*<Input type="number" placeholder="请输入年龄" />*/}
              <DatePicker placeholder="请选择年龄" style={{ width: '100%' }} />
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
              label="身高"
              name="height"
              rules={[{ required: true, message: '请输入身高' }]}
            >
              <Input type="number" placeholder="请输入身高" suffix="cm" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="体重"
              name="weight"
              rules={[{ required: true, message: '请输入体重' }]}
            >
              <Input type="number" placeholder="请输入体重" suffix="kg" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="手机号码"
              name="mobile"
              rules={[{ required: true, message: '请输入手机号码' }]}
            >
              <Input type="number" placeholder="请输入手机号码" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="设备SN码"
              name="sn"
              rules={[{ required: false, message: '请输入设备SN码' }]}
            >
              <Input disabled type="number" placeholder="请输入设备SN码" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="4G网关盒SN码"
              name="boxSn"
              rules={[{ required: false, message: '请输入4G网关盒SN码' }]}
            >
              <Input disabled type="number" placeholder="请输入4G网关盒SN码" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default MiniProgramUserEdit
