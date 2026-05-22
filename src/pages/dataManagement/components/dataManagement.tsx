import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './dataManagement.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  TreeSelect
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DataManagementNew from './dataManagementNew'
import { EFormatAnalysisState, IPagination } from '@/pages/common/types/common'
import DayJS from 'dayjs'
import { PlusOutlined } from '@ant-design/icons'
import DataManagementEdit from './dataManagementEdit'
import AssignDynamicDoctor from './assignDynamicDoctor'
import AssignHealthDoctor from './assignHealthDoctor'

import {
  filterAnalysisState,
  filterInspectionResult,
  filterPositiveLevelResult,
  gender,
  hasPermission
} from '@/utils'
import dataManagement from '@/pages/dataManagement/services/dataManagement'
import { organizationService } from '@/pages/organization/services'
import { Permission } from '@/components/permission'
import { organizationBusinessService } from '@/pages/organizationBusiness/services'
import { commonService } from '@/pages/common/services'
import { env } from '@/config/env'

interface Props {}

type FieldType = {
  id?: string
  name?: string
  organizationId?: string
  outerBusinessId?: number
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const DataManagement: React.FC<Props> = (props) => {
  const {} = props
  const [isVisibleNew, setIsVisibleNew] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [isVisibleAssignDynamicDoctor, setIsVisibleAssignDynamicDoctor] =
    useState(false)
  const [isVisibleAssignHealthDoctor, setIsVisibleAssignHealthDoctor] =
    useState(false)
  const [organizationBusinessOptions, setOrganizationBusinessOptions] =
    useState<any[]>([])
  const [rowData, setRowData] = useState({})
  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })
  const [organizationOptions, setOrganizationOptions] = useState([])

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: '数据识别号',
      dataIndex: 'id',
      key: 'id',
      render: (value) => <span>{value}</span>
    },
    {
      title: '分析入口',
      dataIndex: 'id',
      key: 'id',
      render: (value, record) => (
        <div>
          <Permission code="dataManagement.list.local.analysis">
            <Button
              type="link"
              size="small"
              onClick={() => onLocalAnalysis(record)}
            >
              本地分析
            </Button>
          </Permission>
        </div>
      )
    },
    {
      title: '体检号',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (value) => <span>{value}</span>
    },
    {
      title: '业务类型',
      dataIndex: 'outerBusinessName',
      key: 'outerBusinessName',
      render: (value) => <span>{value}</span>
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (value) => <span>{gender(value)}</span>
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (value) => <span>{value}</span>
    },
    {
      title: '电话号码',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value) => <span>{value}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <span>
          <Badge
            status={
              value === EFormatAnalysisState.wear
                ? 'error'
                : value === EFormatAnalysisState.preAnalysis
                ? 'warning'
                : 'success'
            }
            text={filterAnalysisState(value)}
          />
        </span>
      )
    },
    {
      title: '佩戴开始时间',
      dataIndex: 'wearStartTime',
      key: 'wearStartTime',
      width: 180,
      render: (value, record) => (
        <div>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
    {
      title: '数据来源',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (value) => <span>{value}</span>
    },
    {
      title: '检查结果',
      dataIndex: 'positive',
      key: 'positive',
      render: (value) => <span>{filterInspectionResult(value)}</span>
    },
    {
      hidden: !hasPermission('dataManagement.list.positiveLevel'),
      title: '阳性等级',
      dataIndex: 'positiveLevel',
      key: 'positiveLevel',
      render: (value) => <span>{filterPositiveLevelResult(value)}</span>
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (value, record) => (
        <div>
          <span> {value}</span>
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
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (value) => (
        <div className={cn(styles.tableActions)}>
          <Permission code="dataManagement.list.dynamic">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onAssignDynamicDoctor(value)}
            >
              动态报告
            </Button>
          </Permission>
          <Permission code="dataManagement.list.health">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onAssignHealthDoctor(value)}
            >
              健康报告
            </Button>
          </Permission>
          <Permission code="dataManagement.list.edit">
            <Button
              type="text"
              className={cn(['gGeneralTextButton'])}
              onClick={() => onEdit(value)}
            >
              编辑
            </Button>
          </Permission>
          <Permission code="dataManagement.list.delete">
            <Popconfirm
              title="是否确认删除？"
              description="此操作会将当前的数据删除，您确定要删除吗？"
              onConfirm={() => onDelete(value)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" className={cn(['gDeleteTextButton'])}>
                删除
              </Button>
            </Popconfirm>
          </Permission>
        </div>
      )
    }
  ]

  useEffect(() => {
    getOrganizationList()
    getOrganizationBusinessList()
  }, [])

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    const { data } = await dataManagement.getList({
      ...values,
      ...pagination
    })
    console.log('获取的数据管理列表', data)
    setTableData(data?.list)
    setTotal(data?.total)
  }, [pagination])

  const getOrganizationList = async () => {
    const { code, data } = await organizationService.getList()
    if (code === '200') {
      console.log('获取的机构数据', data)
      setOrganizationOptions(data.list)
    }
  }

  const getOrganizationBusinessList = async () => {
    const { data } = await organizationBusinessService.getList()
    setOrganizationBusinessOptions(data.list)
  }

  const onDelete = async (value: any) => {
    const data = await dataManagement.delete(value.id)
    if (data.code === '200') {
      message.success('删除数据管理成功')
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

  const onAssignDynamicDoctor = (value: any) => {
    setIsVisibleAssignDynamicDoctor(true)
    setRowData(value)
  }

  const onAssignHealthDoctor = (value: any) => {
    setIsVisibleAssignHealthDoctor(true)
    setRowData(value)
  }

  const onEdit = (value: any) => {
    setIsVisibleEdit(true)
    setRowData(value)
  }

  const handleOk = () => {
    console.log('操作成功')
    setIsVisibleNew(false)
    setIsVisibleEdit(false)
    getList()
  }

  const handleAssignDoctorOk = () => {
    setIsVisibleAssignDynamicDoctor(false)
    setIsVisibleAssignHealthDoctor(false)
  }

  const onLocalAnalysis = async (value: any) => {
    console.log('本地分析', value)

    const { code, data, msg } = await commonService.updateEcgAnalysisStatus({
      id: value.id,
      status: 3
    })

    // if (code !== '200') {
    //   message.error(msg)
    //   return
    // }

    window.location.replace(
      `YuanXinTool://${value.id}_${value.channelId || ''}_${encodeURIComponent(
        value.name
      )}_F?version=2&env=${env.UMI_ENV === 'production' ? 2 : 1}&signed=${
        value.signed
      }`
    )

    // let url = `YuanXinTool://${value.id}_${value.channelId || ''}_${
    //   value.name
    // }_F?version=2&env=${env.UMI_ENV === 'production' ? 2 : 1}&signed=${
    //   value.signed
    // }`
    //
    // window.location.href = url
  }

  return (
    <div className={cn(styles.dataManagement)}>
      <HeaderWrapper
        title="数据管理"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType> label="数据识别号" name="id">
            <Input placeholder="请输入数据识别号" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="用户名" name="name">
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType> label="机构" name="organizationId">
            <TreeSelect
              placeholder="请选择机构"
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
        <Col span={6}>
          <Form.Item<FieldType> label="机构业务类型" name="outerBusinessId">
            <Select
              placeholder="请选择机构业务类型"
              options={organizationBusinessOptions}
              fieldNames={{
                label: 'name',
                value: 'id'
              }}
              allowClear
            />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Button
              icon={<PlusOutlined />}
              className={cn(['gMainButton'])}
              type="primary"
              onClick={onNew}
            >
              新增
            </Button>
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

        <DataManagementNew
          isVisible={isVisibleNew}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleNew(false)}
        />

        <DataManagementEdit
          rowData={rowData}
          isVisible={isVisibleEdit}
          handleOk={handleOk}
          handleCancel={() => setIsVisibleEdit(false)}
        />

        <AssignDynamicDoctor
          rowData={rowData}
          isVisible={isVisibleAssignDynamicDoctor}
          handleOk={handleAssignDoctorOk}
          handleCancel={() => setIsVisibleAssignDynamicDoctor(false)}
        />

        <AssignHealthDoctor
          rowData={rowData}
          isVisible={isVisibleAssignHealthDoctor}
          handleOk={handleAssignDoctorOk}
          handleCancel={() => setIsVisibleAssignHealthDoctor(false)}
        />
      </ContentWrapper>
    </div>
  )
}

export default DataManagement
