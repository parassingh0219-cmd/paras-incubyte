import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, Popconfirm, Select, Skeleton, Space, Table } from 'antd';
import { useEmployees } from '../hooks/useEmployees.js';
import { useDeleteEmployee } from '../hooks/useEmployeeMutations.js';
import EmployeeFormModal from './EmployeeFormModal.jsx';

const { Search } = Input;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function EmployeeTable() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [country, setCountry] = useState();
  const [department, setDepartment] = useState();
  const [page, setPage] = useState(1);
  const [debouncedPageSize, setDebouncedPageSize] = useState(20);
  const [pageSize, setPageSize] = useState(20);
  const [modal, setModal] = useState({ open: false, mode: 'create', employee: null });

  const deleteMutation = useDeleteEmployee();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, country, department]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      country,
      department,
      page,
      limit: pageSize,
    }),
    [debouncedSearch, country, department, page, pageSize],
  );

  const { data, isLoading, isFetching } = useEmployees(filters);

  const columns = [
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Job title', dataIndex: 'jobTitle', key: 'jobTitle' },
    { title: 'Country', dataIndex: 'country', key: 'country', width: 100 },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      width: 120,
      render: (value) => currency.format(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            aria-label={`Edit ${record.fullName}`}
            onClick={() => setModal({ open: true, mode: 'edit', employee: record })}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this employee?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteMutation.mutate(record._id)}
          >
            <Button type="link" danger aria-label={`Delete ${record.fullName}`}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <section className="employee-table">
        <Space wrap className="employee-table__filters" style={{ marginBottom: '1.5rem' }}>
          <Skeleton.Button active style={{ width: 280, height: 32 }} />
          <Skeleton.Button active style={{ width: 140, height: 32 }} />
          <Skeleton.Button active style={{ width: 180, height: 32 }} />
          <Skeleton.Button active style={{ width: 120, height: 32 }} />
        </Space>
        <Card bordered={false}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </section>
    );
  }

  return (
    <section className="employee-table">
      <Space wrap className="employee-table__filters">
        <Search
          allowClear
          placeholder="Search name, title, country…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 280 }}
          aria-label="Search employees"
        />
        <Select
          allowClear
          placeholder="Country"
          value={country}
          onChange={setCountry}
          style={{ width: 140 }}
          options={[
            { value: 'US', label: 'US' },
            { value: 'UK', label: 'UK' },
            { value: 'DE', label: 'DE' },
            { value: 'IN', label: 'IN' },
            { value: 'CA', label: 'CA' },
          ]}
        />
        <Select
          allowClear
          placeholder="Department"
          value={department}
          onChange={setDepartment}
          style={{ width: 180 }}
          options={[
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Design', label: 'Design' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Sales', label: 'Sales' },
            { value: 'Operations', label: 'Operations' },
          ]}
        />
        <Button type="primary" onClick={() => setModal({ open: true, mode: 'create', employee: null })}>
          Add employee
        </Button>
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading || isFetching}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          showSizeChanger: true,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          },
        }}
      />

      <EmployeeFormModal
        open={modal.open}
        mode={modal.mode}
        employee={modal.employee}
        onClose={() => setModal({ open: false, mode: 'create', employee: null })}
      />
    </section>
  );
}
