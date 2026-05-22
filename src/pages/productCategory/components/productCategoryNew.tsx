import React, { memo, useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row, TreeSelect } from 'antd'
import cn from 'classnames'
import styles from './productCategoryNew.less'
import { AdvancedButton } from '@/components/advancedButton'
import { EType } from '@/components/advancedButton/types/advancedButton'
import { productCategoryService } from '../services'

interface Props {
  isVisible?: boolean
  handleOk?: () => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  code?: string
  parentId?: string
}
const ProductCategoryNew: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [categoryOption, setCategoryOption] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (isVisible) {
      getCategoryList()
    }
  }, [isVisible])

  const getCategoryList = async () => {
    const { code, data } = await productCategoryService.getList()
    console.log('获取的产品类别列表', data.list)
    if (code === '200') {
      setCategoryOption(data.list)
    }
  }
  const onOk = async () => {
    const values = await form.validateFields()
    console.log('内容', values)
    let parentId = values.parentId[0]
    delete values.parentId
    const data = await productCategoryService.add({ ...values, parentId })

    if (data.code === '200') {
      message.success('新增产品类别成功')
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
      title="新增产品类别"
      open={isVisible}
      width={568}
      centered
      onOk={onOk}
      onCancel={onCancel}
      className={cn(styles.productCategoryNew)}
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
              label="父类别"
              name="parentId"
              rules={[{ required: false, message: '请选择父类别' }]}
            >
              <TreeSelect
                placeholder="请选择父类别"
                treeData={categoryOption}
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
              label="产品类别名称"
              name="name"
              rules={[{ required: true, message: '请输入产品类别名称' }]}
            >
              <Input placeholder="请输入产品类别名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="唯一标识码"
              name="code"
              rules={[{ required: true, message: '请输入唯一标识码' }]}
            >
              <Input placeholder="请输入唯一标识码" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default ProductCategoryNew
