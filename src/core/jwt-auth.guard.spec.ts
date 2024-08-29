import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockJwtService: JwtService;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn(),
    } as unknown as JwtService;
    guard = new JwtAuthGuard(mockJwtService);
  });

  it('should return false if no token is provided', () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;
    // Act
    const actualResult = guard.canActivate(mockContext);
    // Assert
    expect(actualResult).toBe(false);
  });

  it('should return true for a valid token', () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer validtoken' },
        }),
      }),
    } as ExecutionContext;
    const expectedPayload = { sub: 'user123' };
    (mockJwtService.verify as jest.Mock).mockReturnValue(expectedPayload);
    // Act
    const actualResult = guard.canActivate(mockContext);
    // Assert
    expect(actualResult).toBe(true);
    expect(mockJwtService.verify).toHaveBeenCalledWith('validtoken');
  });

  it('should return false for an invalid token', () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalidtoken' },
        }),
      }),
    } as ExecutionContext;
    (mockJwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    // Act
    const actualResult = guard.canActivate(mockContext);
    // Assert
    expect(actualResult).toBe(false);
  });
});
