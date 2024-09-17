import { AdminModule } from '@api/admin/admin.module';
import { NotificationModule } from '@api/notification/notification.module';
import { DbModule } from '@core/db.module';
import { LogModule } from '@core/log/log.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@shared/auth/auth.module';

const envFilePath = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
const configOptions = {
  envFilePath,
  isGlobal: true,
  cache: true,
};

/**
 * Main application module
 * @description This module is the entry point for the application. It imports all the necessary modules and provides them to the application.
 */
@Module({
  imports: [ConfigModule.forRoot(configOptions), LogModule, DbModule, AuthModule, NotificationModule, AdminModule],
})
export class AppModule {}
