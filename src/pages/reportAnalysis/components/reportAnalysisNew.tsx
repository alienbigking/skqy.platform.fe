import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  TreeSelect
} from 'antd'
import cn from 'classnames'
import styles from './reportAnalysisNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { organizationService } from '@/pages/organization/services'
import { internalBusinessService } from '@/pages/internalBusiness/services'
import { organizationBusinessService } from '@/pages/organizationBusiness/services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  header?: string
  organizationId?: string
  innerBusinessId?: string
  sort?: number
  remark?: string
}
const ReportAnalysisNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [internalBusinessOptions, setInternalBusinessOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      getInternalBusinessList()
      getOrganizationList()
    }
  }, [isVisible])

  const getOrganizationList = async () => {
    const { code, data } = await organizationService.getList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }
  const getInternalBusinessList = async () => {
    const { data } = await internalBusinessService.getList()
    setInternalBusinessOptions(data.list)
  }

  const onSelectOrganization = () => {}
  const onSelectMenu = (value: string[]) => {
    console.log('当前选中的菜单', value)
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    const data = await organizationBusinessService.add({ ...values })

    if (data.code === '200') {
      message.success('新增机构业务配置成功')
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
      className={cn(styles.reportAnalysisNew)}
      title="新增机构业务配置"
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
              label="业务名称"
              name="name"
              rules={[{ required: true, message: '请输入业务名称' }]}
            >
              <Input placeholder="请输入业务名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="健康报告表头"
              name="header"
              rules={[{ required: true, message: '请输入健康报告表头' }]}
            >
              <Input placeholder="请输入健康报告表头" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="关联机构"
              name="organizationId"
              rules={[{ required: false, message: '请选择关联机构' }]}
            >
              <TreeSelect
                placeholder="请选择关联机构"
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
              label="内部业务类型"
              name="innerBusinessId"
              rules={[{ required: true, message: '请选择内部业务类型' }]}
            >
              <Select
                placeholder="请选择内部业务类型"
                options={internalBusinessOptions}
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="排序"
              name="sort"
              rules={[{ required: false, message: '请输入排序' }]}
            >
              <InputNumber
                placeholder="请输入排序"
                min={0}
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="备注"
              name="remark"
              rules={[{ required: false, message: '请输入备注' }]}
            >
              <Input placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default ReportAnalysisNew
