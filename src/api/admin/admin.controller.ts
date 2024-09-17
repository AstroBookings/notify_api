import { AuthApiKeyGuard } from '@abs/auth/auth-api-key.guard';
import { Controller, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

/**
 * Admin Controller
 * @description Controller for administrative endpoints
 */
@Controller('api/admin')
@UseGuards(AuthApiKeyGuard)
export class AdminController {
  readonly #logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {
    this.#logger.verbose('🚀  initialized');
  }

  /**
   * Regenerates the database
   * @returns Object with the operation status and message
   */
  @Post('regenerate-db')
  @HttpCode(200)
  async regenerateDatabase(): Promise<{ status: string; message: string }> {
    this.#logger.verbose('🤖 Regenerating database');
    return this.adminService.regenerateDatabase();
  }

  /**
   * Test endpoint to verify the admin module functionality
   * @returns Object with the operation status and message
   */
  @Post('test')
  @HttpCode(200)
  async adminTest(): Promise<{ status: string; message: string }> {
    this.#logger.verbose('🤖 Testing admin module');
    return this.adminService.adminTest();
  }
}
