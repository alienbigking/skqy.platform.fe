import React, { useState } from 'react'
import cn from 'classnames'
import styles from './personalSet.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Col, Form } from 'antd'
import { IPagination } from '@/pages/common/types/common'
import PersonalSetEdit from './personalSetEdit'
import SystemInfo from '@/pages/personalSet/components/systemInfo'
import UserGuide from '@/pages/personalSet/components/userGuide'

interface Props {}

type FieldType = {
  name?: string
  remember?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const PersonalSet: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  return (
    <div className={cn(styles.personalSet)}>
      <HeaderWrapper title="个人设置" form={form} isHideSearch={true}>
        <Col span={6}>
          {/*<Form.Item<FieldType>*/}
          {/*  label="角色名"*/}
          {/*  name="name"*/}
          {/*  rules={[{ required: false, message: '请输入角色名' }]}*/}
          {/*>*/}
          {/*  <Input placeholder="请输入角色名" allowClear />*/}
          {/*</Form.Item>*/}
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.content)}>
            <PersonalSetEdit
              rowData={rowData}
              isVisible={isVisibleEdit}
              handleCancel={() => setIsVisibleEdit(false)}
            />
            <SystemInfo />
            <UserGuide />
          </div>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default PersonalSet
