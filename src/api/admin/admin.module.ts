import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

/**
 * AdminModule
 * @description Module for administrative and maintenance functions
 */
@Module({
  imports: [MikroOrmModule.forFeature([])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
