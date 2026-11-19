import { buildEmployeeQuery } from '../src/api/employeeQuery.js';

describe('buildEmployeeQuery', () => {
  it('serializes search and pagination params', () => {
    const qs = buildEmployeeQuery({
      search: 'engineer',
      country: 'US',
      page: 2,
      limit: 20,
    });

    expect(qs).toContain('search=engineer');
    expect(qs).toContain('country=US');
    expect(qs).toContain('page=2');
    expect(qs).toContain('limit=20');
  });

  it('omits empty values', () => {
    expect(buildEmployeeQuery({ search: '', country: undefined })).toBe('');
  });
});
