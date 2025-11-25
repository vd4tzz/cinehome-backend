import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';

@ApiTags('User')
@Controller('me')
export class MeController {
  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Lấy thông tin user hiện tại',
    description: 'Trả về userId từ JWT token đã đăng nhập'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin user',
    schema: {
      example: { id: 'uuid-here' }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  whoami(@UserId() userId: string) {
    return { id: userId };
  }
}
