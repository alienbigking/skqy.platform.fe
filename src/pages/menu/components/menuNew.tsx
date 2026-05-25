import React, { memo, useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Switch,
  TreeSelect
} from 'antd'
import cn from 'classnames'
import styles from './menuNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { menuService } from '@/pages/menu/services'
import { EPageType } from '@/pages/common/types/common'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  type?: string
  name?: string
  pid?: string
  url?: string
  icon?: string
  sort?: number
  isActive?: boolean
}
const MenuNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [menuOptions, setMenuOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      getMenuList(EPageType.menu)
    }
  }, [isVisible])

  const getMenuList = async (type?: EPageType) => {
    const { data } = await menuService.getMenuListByType({
      type: type as EPageType
    })
    setMenuOptions(data?.list || [])
  }

  const onOk = async () => {
    const values = await form.validateFields()
    values.pid = values.pid || '0'
    const data = await menuService.add({
      ...values,
      type: EPageType.menu
    })
    if (data.status === 0) {
      message.success('新增菜单成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(data.message || '新增失败')
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onChangeNumber = () => {}

  return (
    <Modal
      className={cn(styles.menuNew)}
      title="新增菜单"
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
        name="searchform"
        autoComplete="off"
        colon={false}
        labelAlign="right"
        labelCol={{ span: 4 }}
        initialValues={{ type: EPageType.menu, sort: 1, isActive: true }}
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
              label="关联菜单"
              name="pid"
              rules={[{ required: false, message: '请选择关联菜单' }]}
            >
              <TreeSelect
                placeholder="请选择关联菜单"
                treeData={menuOptions}
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
              label="路由"
              name="url"
              rules={[{ required: false, message: '请输入路由' }]}
            >
              <Input placeholder="请输入路由" />
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
              label="启用"
              name="isActive"
              valuePropName="checked"
              rules={[{ required: false, message: '请选择状态' }]}
            >
              <Switch />
            </Form.Item>
          </Col>
          {/*<Col span={24}>*/}
          {/*  <Form.Item<FieldType>*/}
          {/*    label="图标"*/}
          {/*    name="icon"*/}
          {/*    rules={[{ required: false, message: '请选择图标' }]}*/}
          {/*  >*/}
          {/*    <Select*/}
          {/*      defaultValue=""*/}
          {/*      onChange={onSelectMenu}*/}
          {/*      options={[*/}
          {/*        { value: 'jack', label: 'Jack' },*/}
          {/*        { value: 'lucy', label: 'Lucy' },*/}
          {/*        { value: 'Yiminghe', label: 'yiminghe' },*/}
          {/*        { value: 'disabled', label: 'Disabled', disabled: true }*/}
          {/*      ]}*/}
          {/*    />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
        </Row>
      </Form>
    </Modal>
  )
})

export default MenuNew
