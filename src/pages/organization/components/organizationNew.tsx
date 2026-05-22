import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  TreeSelect
} from 'antd'
import cn from 'classnames'
import styles from './organizationNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { menuService } from '@/pages/menu/services'
import { uploadNoticeOptions } from '@/utils'
import { organizationService } from '@/pages/organization/services'
import { commonService } from '@/pages/common/services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  pid?: number
  contact?: string
  mobile?: number
  address?: string
  remark?: string
  sort?: string
  uploadNotice: number
}
const OrganizationNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    console.log('当前是否显示', isVisible)
    if (isVisible) {
      getMenuList()
      getOrganizationList()
    }
  }, [isVisible])

  const getMenuList = async () => {
    const { data } = await menuService.getList()
    const result = data.list.map((item: any) => {
      item.value = item.id
      item.label = item.name
      return item
    })
    setMenuOptions(result)
  }

  const getOrganizationList = async () => {
    const { code, data } = await commonService.getAllOrganizationsList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    values.pid = values.pid ? values.pid : '0'
    const data = await organizationService.add({ ...values })

    if (data.code === '200') {
      message.success('新增机构成功')
      form.resetFields()
      handleOk?.()
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onChangeNumber = () => {}

  return (
    <Modal
      className={cn(styles.organizationNew)}
      title="新增机构"
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
        labelCol={{ span: 5 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="上级机构"
              name="pid"
              rules={[{ required: false, message: '请选择上级机构' }]}
            >
              {/*<Select*/}
              {/*  options={organizationOptions}*/}
              {/*  allowClear*/}
              {/*  fieldNames={{*/}
              {/*    label: 'name',*/}
              {/*    value: 'id'*/}
              {/*  }}*/}
              {/*/>*/}
              <TreeSelect
                placeholder="请选择上级机构"
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
              label="机构联系人"
              name="contact"
              rules={[{ required: false, message: '请输入机构联系人' }]}
            >
              <Input placeholder="请输入机构联系人" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="联系方式"
              name="mobile"
              rules={[{ required: false, message: '请输入联系方式' }]}
            >
              <Input placeholder="请输入联系方式" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="联系地址"
              name="address"
              rules={[{ required: false, message: '请输入联系地址' }]}
            >
              <Input placeholder="请输入联系地址" />
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
                style={{ width: 120 }}
                min={0}
                onChange={onChangeNumber}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="数据上传通知"
              name="uploadNotice"
              rules={[{ required: false, message: '请选择数据上传通知' }]}
            >
              <Radio.Group options={uploadNoticeOptions} />
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

export default OrganizationNew
