import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './interpretationManagement.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Col, Form, message, Select, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import InterpretationManagementEdit from './interpretationManagementEdit'
import { EUrgencyType, IPagination } from '@/pages/common/types/common'
import { interpretationManagementService } from '../services'
import DayJS from 'dayjs'
import {
  filterInterpretationStatus,
  filterSubmissionStatus,
  filterUrgencyType
} from '@/utils/filters'
import {
  interpretationStatusOptions,
  submissionStatusOptions
} from '@/utils/options'

interface Props {}

type FieldType = {
  interpretationStatus?: string
  submissionStatus?: string
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const InterpretationManagement: React.FC<Props> = (props) => {
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

  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'ecgData',
      key: 'ecgData',
      render: (value, record) => (
        <div>
          <span> {value.name}</span>
        </div>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'product',
      key: 'product',
      render: (value, record) => (
        <div>
          <span> {value?.name}</span>
        </div>
      )
    },
    {
      title: '是否加急',
      dataIndex: 'urgencyType',
      key: 'urgencyType',
      render: (value) => (
        <span>
          {value === EUrgencyType.standard ? (
            <Tag color="green">{filterUrgencyType(value)}</Tag>
          ) : (
            <Tag color="gold">{filterUrgencyType(value)}</Tag>
          )}
        </span>
      )
    },

    {
      title: '解读状态',
      dataIndex: 'interpretationStatus',
      key: 'submissionStatus',
      render: (value, record) => (
        <div>
          <span> {filterInterpretationStatus(value)}</span>
        </div>
      )
    },
    {
      title: '提交状态',
      dataIndex: 'submissionStatus',
      key: 'submissionStatus',
      render: (value, record) => (
        <div>
          <span> {filterSubmissionStatus(value)}</span>
        </div>
      )
    },
    {
      title: '异常原因',
      dataIndex: 'exceptionReason',
      key: 'exceptionReason',
      render: (value, record) => (
        <div>
          <span> {value ? value : '--'}</span>
        </div>
      )
    },

    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    }
    // {
    //   title: '操作',
    //   key: 'action',
    //   width: 250,
    //   fixed: 'right',
    //   render: (value) => (
    //     <div className={cn(styles.tableActions)}>
    //       <Permission code="role.list.delete">
    //         <Popconfirm
    //           title="是否确认删除？"
    //           description="此操作会将当前的数据删除，您确定要删除吗？"
    //           onConfirm={() => onDelete(value)}
    //           okText="确定"
    //           cancelText="取消"
    //         >
    //           <Button type="text" className={cn(['gDeleteTextButton'])}>
    //             删除
    //           </Button>
    //         </Popconfirm>
    //       </Permission>
    //     </div>
    //   )
    // }
  ]

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await interpretationManagementService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的解读列表', data)
    setTableData(data.list)
    setTotal(data.total)
  }, [pagination])

  const getOrganizationsText = (value: any[]) => {
    return value?.map((item: any, index: number) => (
      <span key={item.id}>
        {item.name + (index < value.length - 1 ? '、' : '')}
      </span>
    ))
  }

  const onDelete = async (value: any) => {
    const data = await interpretationManagementService.delete(value.id)
    if (data.code === '200') {
      message.success('删除解读成功')
      getList()
    }
  }
  const onSearch = (values: any) => {
    setPagination({
      pageNum: 1,
      pageSize: pagination.pageSize
    })
  }

  const onReset = () => {
    setPagination({
      pageNum: 1,
      pageSize: 10
    })
  }

  const onChangeTable = (pagination: any, filters: any) => {
    console.log('分页', pagination, filters)
    setPagination({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const onNew = () => {
    setIsVisibleNew(true)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }

  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  return (
    <div className={cn(styles.interpretationManagement)}>
      <HeaderWrapper
        title="解读管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType> label="解读状态" name="interpretationStatus">
            <Select
              placeholder="请选择解读状态"
              options={interpretationStatusOptions}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="提交状态" name="submissionStatus">
            <Select
              placeholder="请选择提交状态"
              options={submissionStatusOptions}
              allowClear
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            {/*<Button*/}
            {/*  icon={<PlusOutlined />}*/}
            {/*  className={cn(['gMainButton'])}*/}
            {/*  type="primary"*/}
            {/*  onClick={onNew}*/}
            {/*>*/}
            {/*  新增*/}
            {/*</Button>*/}
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              onChange={onChangeTable}
              // sticky={true}
              scroll={{ x: 'max-content' }}
              pagination={{
                total: total,
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计${total}条`
              }}
            />
          </div>
        </div>

        <InterpretationManagementEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleNewOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default InterpretationManagement
