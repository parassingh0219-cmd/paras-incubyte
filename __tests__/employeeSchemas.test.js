import { employeeFormSchema, mapZodErrors } from '../src/schemas/employeeSchemas.js';

describe('employeeFormSchema', () => {
  it('accepts valid employee input', () => {
    const result = employeeFormSchema.safeParse({
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'US',
      salary: 90_000,
      department: 'Engineering',
    });

    expect(result.success).toBe(true);
  });

  it('maps validation errors by field', () => {
    const result = employeeFormSchema.safeParse({
      fullName: '',
      jobTitle: 'Engineer',
      country: 'US',
      salary: -1,
      department: 'Engineering',
    });

    expect(result.success).toBe(false);
    const errors = mapZodErrors(result.error);
    expect(errors.fullName).toBeDefined();
    expect(errors.salary).toBeDefined();
  });
});
