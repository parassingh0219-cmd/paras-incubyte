import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import EmployeeFormModal from '../src/components/EmployeeFormModal.jsx';

vi.mock('../src/hooks/useEmployeeMutations.js', () => ({
  useCreateEmployee: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateEmployee: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

function renderModal(props = {}) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <EmployeeFormModal
        open
        mode="create"
        employee={null}
        onClose={vi.fn()}
        {...props}
      />
    </QueryClientProvider>,
  );
}

describe('EmployeeFormModal', () => {
  it('renders accessible create dialog', () => {
    renderModal();
    expect(screen.getByText('Add employee')).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Salary')).toBeInTheDocument();
  });

  it('renders edit mode title', () => {
    renderModal({
      mode: 'edit',
      employee: {
        _id: '1',
        fullName: 'Alice',
        jobTitle: 'Engineer',
        country: 'US',
        salary: 100_000,
        department: 'Engineering',
      },
    });
    expect(screen.getByText('Edit employee')).toBeInTheDocument();
  });
});
