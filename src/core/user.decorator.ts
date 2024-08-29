import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract user information from the request.
 * @param data - Optional key to extract specific user data.
 * @param ctx - The execution context.
 * @returns The user object or a specific user property.
 */
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});
