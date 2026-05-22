import React, { memo, useEffect, useState } from 'react'
import { Col, Form, message, Modal, Row, Select } from 'antd'
import cn from 'classnames'
import styles from './assignDynamicDoctor.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { isNullObject } from '@/utils'
import { commonService } from '@/pages/common/services'
import { dataManagementService } from '@/pages/dataManagement/services'

interface Props {
  rowData?: any
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  username?: string
}

const AssignDynamicDoctor: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel, rowData } = props
  const [form] = Form.useForm()
  const [doctorOptions, setDoctorOptions] = useState([])

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getUserList()
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { code, data } = await dataManagementService.getDetail(rowData.id)
    console.log('获取的动态报告详情', data)
    if (code === '200') {
      handleEditData(data)
    }
  }

  const getUserList = async () => {
    const { code, data } = await commonService.getDoctorList()
    if (code === '200') {
      console.log('获取的医师列表数据', data)
      setDoctorOptions(data)
    }
  }

  const handleEditData = (values: any) => {
    form.setFieldsValue({
      ...values,
      username: values.dynamicAnalysisUserName
        ? values.dynamicAnalysisUserName
        : null
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('表单内容', values)
    const data = await dataManagementService.updateAssignDynamicDoctor({
      id: rowData.id,
      dynamicAnalysisUserId: values.username
    })
    if (data.code === '200') {
      message.success('分配动态报告医师成功')
      handleOk?.()
      form.resetFields()
    }
  }
  const onCancel = () => {
    handleCancel?.()
    form.resetFields()
  }

  return (
    <Modal
      className={cn(styles.assignDynamicDoctor)}
      title="分配动态报告医师"
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
              label="动态报告医师"
              name="username"
              rules={[{ required: true, message: '请选择动态报告医师' }]}
            >
              <Select
                placeholder="请选择动态报告医师"
                options={doctorOptions}
                fieldNames={{
                  label: 'username',
                  value: 'id'
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default AssignDynamicDoctor
