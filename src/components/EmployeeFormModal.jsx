import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import { employeeFormSchema, mapZodErrors } from '../schemas/employeeSchemas.js';
import { useCreateEmployee, useUpdateEmployee } from '../hooks/useEmployeeMutations.js';

const COUNTRY_OPTIONS = ['US', 'UK', 'DE', 'IN', 'CA', 'AU', 'FR', 'SG'].map((value) => ({
  value,
  label: value,
}));

/**
 * @param {{
 *   open: boolean;
 *   mode: 'create' | 'edit';
 *   employee?: Record<string, unknown> | null;
 *   onClose: () => void;
 * }} props
 */
export default function EmployeeFormModal({ open, mode, employee, onClose }) {
  const [form] = Form.useForm();
  const [fieldErrors, setFieldErrors] = useState({});
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const title = mode === 'create' ? 'Add employee' : 'Edit employee';

  useEffect(() => {
    if (!open) return;

    if (employee) {
      form.setFieldsValue({
        fullName: employee.fullName,
        jobTitle: employee.jobTitle,
        country: employee.country,
        salary: employee.salary,
        department: employee.department,
      });
    } else {
      form.resetFields();
    }
    setFieldErrors({});
  }, [open, employee, form]);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const parsed = employeeFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setFieldErrors({});

    if (mode === 'create') {
      await createMutation.mutateAsync(parsed.data);
    } else {
      await updateMutation.mutateAsync({ id: employee._id, ...parsed.data });
    }

    onClose();
  };

  const fieldProps = (name) => ({
    validateStatus: fieldErrors[name] ? 'error' : undefined,
    help: fieldErrors[name],
  });

  return (
    <Modal
      title={<span id="employee-form-title">{title}</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={mode === 'create' ? 'Create' : 'Save'}
      confirmLoading={isSubmitting}
      destroyOnClose
      aria-labelledby="employee-form-title"
    >
      <Form form={form} layout="vertical" name="employeeForm" aria-label="Employee details">
        <Form.Item label="Full name" name="fullName" {...fieldProps('fullName')} required>
          <Input autoComplete="name" />
        </Form.Item>
        <Form.Item label="Job title" name="jobTitle" {...fieldProps('jobTitle')} required>
          <Input autoComplete="organization-title" />
        </Form.Item>
        <Form.Item label="Country" name="country" {...fieldProps('country')} required>
          <Input list="country-options" autoComplete="country-name" />
        </Form.Item>
        <datalist id="country-options">
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} />
          ))}
        </datalist>
        <Form.Item label="Department" name="department" {...fieldProps('department')} required>
          <Input autoComplete="organization" />
        </Form.Item>
        <Form.Item label="Salary" name="salary" {...fieldProps('salary')} required>
          <InputNumber min={0} style={{ width: '100%' }} addonBefore="$" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
