import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('me')
export class MeController {
  @UseGuards(AuthGuard)
  @Get()
  whoami(@UserId() userId: string) {
    return { id: userId };
  }
}
