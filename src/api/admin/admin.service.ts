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
    this.#logger.verbose('🚀 AdminService initialized');
  }

  /**
   * Regenerates the database by executing SQL scripts
   * @returns Object with the operation status and message
   */
  async regenerateDatabase(): Promise<{ status: string; message: string }> {
    try {
      await this.#executeDatabaseScripts();
      return { status: 'success', message: 'Database regenerated successfully' };
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  /**
   * Test method to verify the service functionality
   * @returns Object with the operation status and message
   */
  async adminTest(): Promise<{ status: string; message: string }> {
    return { status: 'success', message: 'Admin test endpoint is working correctly' };
  }

  async #executeDatabaseScripts(): Promise<void> {
    await this.#connection.execute(SQL_SCRIPTS.CLEAR_DATABASE);
    this.#logger.verbose('🤖 Database cleared');
    await this.#connection.execute(SQL_SCRIPTS.CREATE_DATABASE);
    this.#logger.verbose('🤖 Database created');
    await this.#connection.execute(SQL_SCRIPTS.SEED_DATABASE);
    this.#logger.verbose('🤖 Database seeded');
  }

  // Removed private method #createSuccessResponse as per instructions

  #handleDatabaseError(error: Error): { status: string; message: string } {
    this.#logger.debug('👽 Error regenerating database', error.stack);
    throw new Error('Failed to regenerate database');
  }
}
