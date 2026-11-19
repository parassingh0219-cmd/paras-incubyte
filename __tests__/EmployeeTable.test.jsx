import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import EmployeeTable from '../src/components/EmployeeTable.jsx';

vi.mock('../src/components/EmployeeFormModal.jsx', () => ({
  default: () => null,
}));

vi.mock('../src/hooks/useEmployeeMutations.js', () => ({
  useDeleteEmployee: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('antd', () => {
  const React = require('react');

  function Input(props) {
    return React.createElement('input', {
      placeholder: props.placeholder,
      value: props.value,
      onChange: props.onChange,
    });
  }
  Input.Search = Input;

  return {
    Input,
    Button: ({ children, onClick, ...props }) =>
      React.createElement('button', { type: 'button', onClick, ...props }, children),
    Popconfirm: ({ children, onConfirm }) =>
      React.createElement('div', null, children, React.createElement('button', { type: 'button', onClick: onConfirm }, 'confirm')),
    Select: () => React.createElement('select', null),
    Space: ({ children }) => React.createElement('div', null, children),
    Card: ({ children }) => React.createElement('div', null, children),
    Skeleton: Object.assign(
      ({ children }) => React.createElement('div', null, children),
      {
        Button: () => React.createElement('div', null),
      }
    ),
    Table: ({ dataSource = [], loading }) =>
      loading
        ? React.createElement('div', { 'data-testid': 'loading' })
        : React.createElement(
            'div',
            null,
            dataSource.map((row) =>
              React.createElement('span', { key: row._id }, row.fullName),
            ),
          ),
  };
});

function renderTable() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <EmployeeTable />
    </QueryClientProvider>,
  );
}

describe('EmployeeTable', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            _id: '1',
            fullName: 'Alice Anderson',
            jobTitle: 'Engineer',
            country: 'US',
            salary: 120_000,
            department: 'Engineering',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    });
  });

  it('renders employee rows from API', async () => {
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Alice Anderson')).toBeInTheDocument();
    });
  });

  it('shows search input for roster filtering', async () => {
    renderTable();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search name/i)).toBeInTheDocument();
    });
  });
});
