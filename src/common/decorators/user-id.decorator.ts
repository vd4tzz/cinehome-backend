import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @UserId() giúp lấy userId từ request (đã gán bởi AuthGuard)
 * Dùng trong controller: handler(@UserId() userId: string)
 */
export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user?.id;
});
