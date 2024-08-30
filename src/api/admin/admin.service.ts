import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { SQL_SCRIPTS } from './admin.constants';

/**
 * AdminService
 * @description Service for administrative operations
 */
@Injectable()
export class AdminService {
  readonly #logger = new Logger(AdminService.name);
  readonly #connection = this.em.getConnection();

  constructor(private readonly em: EntityManager) {
    this.#logger.log('🚀 AdminService initialized');
  }

  /**
   * Regenerates the database by executing SQL scripts
   * @returns Object with the operation status and message
   */
  async regenerateDatabase(): Promise<{ status: string; message: string }> {
    try {
      await this.#executeDatabaseScripts();
      return this.#createSuccessResponse('Database regenerated successfully');
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  /**
   * Test method to verify the service functionality
   * @returns Object with the operation status and message
   */
  async adminTest(): Promise<{ status: string; message: string }> {
    return this.#createSuccessResponse('Admin test endpoint is working correctly');
  }

  async #executeDatabaseScripts(): Promise<void> {
    await this.#connection.execute(SQL_SCRIPTS.CLEAR_DATABASE);
    this.#logger.log('🤖 Database cleared');
    await this.#connection.execute(SQL_SCRIPTS.CREATE_DATABASE);
    this.#logger.log('🤖 Database created');
    await this.#connection.execute(SQL_SCRIPTS.SEED_DATABASE);
    this.#logger.log('🤖 Database seeded');
  }

  #createSuccessResponse(message: string): { status: string; message: string } {
    return { status: 'success', message };
  }

  #handleDatabaseError(error: Error): { status: string; message: string } {
    this.#logger.error('👽 Error regenerating database', error.stack);
    throw new Error('Failed to regenerate database');
  }
}
