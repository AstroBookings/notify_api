import { Module } from '@nestjs/common';
import { IdService } from './services/id.service';

@Module({
  providers: [IdService],
  exports: [IdService],
})
export class SharedModule {}
