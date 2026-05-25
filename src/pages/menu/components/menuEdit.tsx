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
import styles from './menuEdit.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { menuService } from '@/pages/menu/services'
import { isNullObject } from '@/utils'
import { EPageType } from '@/pages/common/types/common'

interface Props {
  isVisible?: boolean
  rowData?: any
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

const filterSelfAndChildren = (list: any[] = [], id?: string): any[] => {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: filterSelfAndChildren(item.children || [], id)
    }))
}

const MenuEdit: React.FC<Props> = memo((props) => {
  const { isVisible = false, rowData, handleOk, handleCancel } = props
  const [menuOptions, setMenuOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible && !isNullObject(rowData)) {
      getDetail()
      getMenuList(EPageType.menu)
    }
  }, [rowData, isVisible])

  const getDetail = async () => {
    const { status, data } = await menuService.getDetail(rowData.id)
    if (status === 0) {
      handleEditData(data)
    }
  }

  const getMenuList = async (type?: EPageType) => {
    const { data } = await menuService.getMenuListByType({
      type: type as EPageType
    })
    setMenuOptions(filterSelfAndChildren(data?.list || [], rowData?.id))
  }

  const handleEditData = (values: any) => {
    values.pid = values.pid && values.pid !== '0' ? values.pid : undefined
    form.setFieldsValue({
      ...values
    })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    values.pid = values.pid || '0'
    const response = await menuService.update({
      id: rowData.id,
      ...values,
      type: EPageType.menu
    })
    if (response.status === 0) {
      message.success('编辑菜单成功')
      form.resetFields()
      handleOk?.()
    } else {
      message.error(response.message || '编辑失败')
    }
  }
  const onCancel = () => {
    form.resetFields()
    handleCancel?.()
  }

  const onChangeNumber = () => {}

  return (
    <div className={cn(styles.menuEdit)}>
      <Modal
        title="编辑菜单"
        open={isVisible}
        width={568}
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
            {/*    name="name"*/}
            {/*    rules={[{ required: false, message: '请选择图标' }]}*/}
            {/*  >*/}
            {/*    <Select*/}
            {/*      defaultValue="lucy"*/}
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
    </div>
  )
})

export default MenuEdit
