import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row, TreeSelect } from 'antd'
import cn from 'classnames'
import styles from './appConfigNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { roleService } from '@/pages/role/services'
import { menuService } from '@/pages/menu/services'
import { commonService } from '@/pages/common/services'
import { EPageType } from '@/pages/common/types/common'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  organizationIds?: string[]
  menuIds?: []
  remark?: string
}
const AppConfigNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [menuOptions, setMenuOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      getMenuList(EPageType.permission)
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
  const getMenuList = async (type?: EPageType) => {
    const { data } = await menuService.getMenuListByType({
      type: type as EPageType
    })
    const result = data.list.map((item: any) => {
      item.value = item.id
      item.label = item.name
      return item
    })
    setMenuOptions(result)
  }

  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    const data = await roleService.add({ ...values })

    if (data.code === '200') {
      message.success('新增角色成功')
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
      title="新增角色"
      open={isVisible}
      width={568}
      centered
      onOk={onOk}
      onCancel={onCancel}
      className={cn(styles.roleNew)}
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
              label="关联机构"
              name="organizationIds"
              rules={[{ required: false, message: '请选择关联机构' }]}
            >
              <TreeSelect
                placeholder="请选择关联机构"
                multiple
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
              label="关联权限"
              name="menuIds"
              rules={[{ required: false, message: '请选择关联权限' }]}
            >
              <TreeSelect
                placeholder="请选择关联权限"
                multiple
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

export default AppConfigNew
