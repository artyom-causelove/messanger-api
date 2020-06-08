import { RoleGuard } from '@messanger/src/role.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    expect(new RoleGuard(null, null)).toBeDefined();
  });
});
