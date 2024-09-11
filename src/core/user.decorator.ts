import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract user information from the request.
 * @param userProperty - Optional property of the user object to extract.
 * @param ctx - The execution context.
 * @returns The user object or a specific user property.
 */
export const User = createParamDecorator((userProperty: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) return undefined;
  if (!userProperty) return user;
  return user[userProperty];
});
