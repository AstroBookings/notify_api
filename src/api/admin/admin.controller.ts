import { Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

/**
 * AdminController
 * @description Controller for administrative endpoints
 */
@Controller('api/admin')
export class AdminController {
  readonly #logger = new Logger(AdminController.name);
  constructor(private readonly adminService: AdminService) {}

  /**
   * Regenerates the database
   * @returns Object with the operation status and message
   */
  @Post('regenerate-db')
  @HttpCode(200)
  async regenerateDatabase(): Promise<{ status: string; message: string }> {
    this.#logger.log('🧑‍🚀 Regenerating database');
    return this.adminService.regenerateDatabase();
  }

  /**
   * Test endpoint to verify the admin module functionality
   * @returns Object with the operation status and message
   */
  @Post('test')
  @HttpCode(200)
  async adminTest(): Promise<{ status: string; message: string }> {
    this.#logger.log('🧑‍🚀 Testing admin module');
    return this.adminService.adminTest();
  }
}
