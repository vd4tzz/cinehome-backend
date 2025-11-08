import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * AuthGuard dạng "giả" cho DEV:
 * - Lấy userId từ header 'x-user-id'
 * - Nếu không có thì gán userId = '1' (coi như user mặc định)
 * Thực tế bạn sẽ thay bằng JWT/Passport sau.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // header tên thường được chuẩn hóa lower-case sẵn
    const id = req.headers['x-user-id'];
    req.user = { id: id || '1' };
    return true;
  }
}
