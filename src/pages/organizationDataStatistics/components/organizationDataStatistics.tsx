import React, { useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import styles from './organizationDataStatistics.less'
import { HeaderWrapper } from '@/components/headerWrapper'
import { ContentWrapper } from '@/components/contentWrapper'

import { Button, Col, DatePicker, Form, Input, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IPagination } from '@/pages/common/types/common'
import { organizationDataStatisticsService } from '../services'
import DayJS from 'dayjs'
import { dataStatisticsReportTypeOptions } from '@/utils/options'
import { ExportOutlined } from '@ant-design/icons'
import { Permission } from '@/components/permission'

const { RangePicker } = DatePicker

interface Props {}

type FieldType = {
  organizationName?: string
  reportType?: string
  date?: string
}

interface DataType {
  [key: string]: any
}

const OrganizationDataStatistics: React.FC<Props> = (props) => {
  const {} = props

  const [tableData, setTableData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState<IPagination>({
    pageNum: 1,
    pageSize: 10
  })

  const [form] = Form.useForm()

  const baseColumnConfigs: {
    title: string
    dataIndex: keyof DataType
    alwaysShow?: boolean
    render?: (value: any, record: DataType) => React.ReactNode
  }[] = [
    { title: '机构名称', dataIndex: 'organizationName', alwaysShow: true },
    { title: '健康报告次数', dataIndex: 'healthReportTotalCount' },
    { title: 'AI报告次数', dataIndex: 'lePuReportTotalCount' },
    { title: '动态报告次数', dataIndex: 'dynamicReportTotalCount' },
    { title: '今日心电数据上传次数', dataIndex: 'todayCount' },
    { title: '心电数据上传次数总计', dataIndex: 'totalCount' }
    // {
    //   title: '创建时间',
    //   dataIndex: 'createAt',
    //   alwaysShow: true,
    //   render: (value) => (
    //     <span>{DayJS(value).format('YYYY-MM-DD HH:mm:ss')}</span>
    //   )
    // }
  ]
  const hasValue = (field: keyof DataType) => {
    return tableData?.some(
      (item) =>
        item[field] !== null && item[field] !== undefined && item[field] !== ''
    )
  }
  const columns: ColumnsType<DataType> = useMemo(() => {
    console.log('执行次数统计')
    return baseColumnConfigs
      .filter((col) => col.alwaysShow || hasValue(col.dataIndex))
      .map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.dataIndex,
        render: col.render ?? ((value) => <span>{value}</span>)
      }))
  }, [tableData])

  useEffect(() => {
    getList()
  }, [pagination])

  const getList = useCallback(async () => {
    const values = form.getFieldsValue()
    values.reportType = values?.reportType?.toString()
    console.log('values内容', values)
    values.startDate = values?.date
      ? DayJS(values?.date?.[0]).startOf('day').valueOf()
      : ''
    values.endDate = values?.date
      ? DayJS(values?.date?.[1]).endOf('day').valueOf()
      : ''
    delete values.date

    const { data } = await organizationDataStatisticsService.getList({
      ...values,
      ...pagination
    })
    console.log('获取的机构统计列表', data?.list)
    setTableData(data?.list)
    setTotal(data?.total)
  }, [pagination])

  const onSearch = (values: any) => {
    setPagination((prevPagination) => ({
      pageNum: 1,
      pageSize: prevPagination.pageSize
    }))
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

  const onExport = async () => {
    // try {
    const values = form.getFieldsValue()
    values.reportType = values?.reportType?.toString()
    console.log('values内容', values)
    values.startDate = values?.date
      ? DayJS(values?.date?.[0]).startOf('day').valueOf()
      : ''
    values.endDate = values?.date
      ? DayJS(values?.date?.[1]).endOf('day').valueOf()
      : ''
    delete values.date

    const params = { ...values }

    const blob = await organizationDataStatisticsService.exportExcel(
      {
        ...params
      },
      true
    )
    const url = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = '机构统计报表.xlsx'
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    // if (!data || data.length === 0) {
    //   message.warning('暂无可导出的数据')
    //   return
    // }

    // 获取当前要导出的列（即有值的或 alwaysShow）
    //   const exportColumns = baseColumnConfigs.filter(
    //     (col) => col.alwaysShow || hasValue(col.dataIndex)
    //   )
    //
    //   // === 动态生成导出数据 ===
    //   const exportData = data.map((item: any, index: number) => {
    //     const row: Record<string, any> = { 序号: index + 1 }
    //     exportColumns.forEach((col) => {
    //       if (col.dataIndex === 'createAt') {
    //         row[col.title] = DayJS(item.createAt).format('YYYY-MM-DD HH:mm:ss')
    //       } else {
    //         row[col.title] = item[col.dataIndex]
    //       }
    //     })
    //     return row
    //   })
    //
    //   // 生成 worksheet 和 workbook
    //   const ws = XLSX.utils.json_to_sheet(exportData)
    //   const wb = XLSX.utils.book_new()
    //   XLSX.utils.book_append_sheet(wb, ws, '机构数据统计')
    //
    //   const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    //   const fileName = `机构数据统计_${DayJS().format('YYYYMMDD_HHmmss')}.xlsx`
    //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    //   saveAs(blob, fileName)
    //
    //   message.success('报表导出成功 🎉')
    // } catch (error) {
    //   console.error('导出报表失败：', error)
    //   message.error('导出失败，请稍后再试')
    // }
  }
  const handleNewOk = () => {
    console.log('操作成功')
    getList()
  }

  return (
    <div className={cn(styles.organizationDataStatistics)}>
      <HeaderWrapper
        title="机构数据统计"
        form={form}
        onSearchCallback={onSearch}
        onResetCallback={onReset}
      >
        <Col span={6}>
          <Form.Item<FieldType>
            label="机构名称"
            name="organizationName"
            rules={[{ required: false, message: '请输入机构名称' }]}
          >
            <Input placeholder="请输入机构名称" allowClear />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item<FieldType> label="报告类型" name="reportType">
            <Select
              mode="multiple"
              placeholder="请选择报告类型"
              options={dataStatisticsReportTypeOptions}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<FieldType>
            label="选择日期"
            name="date"
            rules={[{ required: false, message: '请选择日期' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </HeaderWrapper>
      <ContentWrapper>
        <div className={cn(styles.main)}>
          <div className={cn(styles.actions)}>
            <Permission code="organizationDataStatistics.list.export">
              <Button
                icon={<ExportOutlined />}
                className={cn(['gMainButton'])}
                type="primary"
                onClick={onExport}
              >
                导出报表
              </Button>
            </Permission>
          </div>
          <div className={cn(styles.content)}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tableData}
              onChange={onChangeTable}
              // sticky={true}
              scroll={{ x: 'max-content' }}
              // pagination={false}
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
      </ContentWrapper>
    </div>
  )
}

export default OrganizationDataStatistics
