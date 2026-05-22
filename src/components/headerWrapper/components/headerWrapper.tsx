import React, { ReactNode, useEffect } from 'react'
import cn from 'classnames'
import styles from './headerWrapper.less'
import { Button, Col, Form, FormInstance, Row } from 'antd'

// import { xxx } from '../types/demo'

interface Props {
  title?: string
  form: FormInstance
  children: ReactNode
  isRemoveHeaderTopPadding?: boolean
  isRemoveHeaderContentTopPadding?: boolean
  isHideSearch?: boolean
  onSearchCallback?: (values: any) => void
  onResetCallback?: () => void
}

const HeaderWrapper: React.FC<Props> = (props) => {
  const {
    title,
    children,
    isHideSearch = false,
    isRemoveHeaderTopPadding = false,
    isRemoveHeaderContentTopPadding = false,
    onSearchCallback,
    onResetCallback,
    form
  } = props
  // const [form] = Form.useForm()

  useEffect(() => {
    console.log('当前的表单对象', form)
  }, [])
  const onSearch = () => {
    const values = form.getFieldsValue()
    console.log('表单内容', values)
    onSearchCallback?.(values)
  }

  const onReset = () => {
    form.resetFields()
    onResetCallback?.()
  }

  return (
    <div
      className={cn([
        styles.headerWrapper,
        isRemoveHeaderTopPadding ? styles.removeHeaderTopPadding : ''
      ])}
    >
      {title && (
        <div className={cn(styles.title)}>
          <span>{title}</span>
        </div>
      )}

      {!isHideSearch && (
        <div
          className={cn([
            styles.content,
            isRemoveHeaderContentTopPadding
              ? styles.removeHeaderContentTopPadding
              : ''
          ])}
        >
          <Form form={form} autoComplete="off" colon={false}>
            <Row gutter={24} className={cn(styles.search)}>
              {children}
              <Col span={6}>
                <div className={cn(styles.searchAction)}>
                  {/*<AdvancedButton*/}
                  {/*  type={EType.general}*/}
                  {/*  title="查询"*/}
                  {/*  customClassName={cn(styles.searchBtn)}*/}
                  {/*  defaultProps={{*/}
                  {/*    onClick: onSearch*/}
                  {/*  }}*/}
                  {/*/>*/}
                  <Button
                    className={cn(['gMainButton', styles.searchBtn])}
                    type="primary"
                    onClick={onSearch}
                  >
                    查询
                  </Button>
                  {/*<AdvancedButton*/}
                  {/*  title="重置"*/}
                  {/*  customClassName={cn(styles.resetBtn)}*/}
                  {/*  defaultProps={{*/}
                  {/*    onClick: onReset*/}
                  {/*  }}*/}
                  {/*/>*/}
                  <Button onClick={onReset}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </div>
  )
}

export default HeaderWrapper
