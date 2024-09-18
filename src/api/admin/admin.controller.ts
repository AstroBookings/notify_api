import { AuthApiKeyGuard } from '@abs/auth/auth-api-key.guard';
import { Controller, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { AdminResponse } from './admin-response.dto';
import { AdminService } from './admin.service';

/**
 * Admin Controller for administrative endpoints
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
   *
   * 📦 Returns an object with the operation status and message
   */
  @Post('regenerate-db')
  @HttpCode(200)
  async regenerateDatabase(): Promise<AdminResponse> {
    this.#logger.verbose('🤖 Regenerating database');
    return this.adminService.regenerateDatabase();
  }

  /**
   * Test endpoint to verify the admin module functionality
   *
   * 📦 Returns an object with the operation status and message
   */
  @Post('test')
  @HttpCode(200)
  async adminTest(): Promise<AdminResponse> {
    this.#logger.verbose('🤖 Testing admin module');
    return this.adminService.adminTest();
  }
}
