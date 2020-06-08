import { SelfGuard } from '@messanger/src/self.guard';

describe('SelfGuard', () => {
  it('should be defined', () => {
    expect(new SelfGuard(null, null)).toBeDefined();
  });
});
