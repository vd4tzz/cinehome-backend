import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HoldsService } from './holds.service';

/**
 * HoldsCleanupService
 * Chạy cron job mỗi phút để dọn dẹp expired holds
 */
@Injectable()
export class HoldsCleanupService {
  private readonly logger = new Logger(HoldsCleanupService.name);

  constructor(private readonly holdsService: HoldsService) {}

  // Chạy mỗi phút để cleanup expired holds
  @Cron(CronExpression.EVERY_MINUTE)
  async handleHoldCleanup() {
    this.logger.debug('Running hold cleanup job...');
    try {
      await this.holdsService.cleanupExpiredHolds();
    } catch (error) {
      this.logger.error(`Hold cleanup job failed: ${error}`);
    }
  }
}
