import { z } from 'zod';

export const employeeFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(200),
  jobTitle: z.string().trim().min(1, 'Job title is required').max(120),
  country: z.string().trim().min(1, 'Country is required').max(80),
  salary: z.coerce.number().min(0, 'Salary cannot be negative'),
  department: z.string().trim().min(1, 'Department is required').max(120),
});

/** @param {import('zod').ZodError} error */
export function mapZodErrors(error) {
  /** @type {Record<string, string>} */
  const errors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
