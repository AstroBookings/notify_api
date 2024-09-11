import { NotificationEntity } from '@api/notification/services/notification.entity';
import { TemplateEntity } from '@api/notification/services/template.entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { DbConfig } from './db.config';

export const mikroOrmConfigFactory = (configService: ConfigService) => {
  const dbConfig: DbConfig = configService.get('db');
  if (dbConfig.type !== 'postgresql') {
    throw new Error(`Database type ${dbConfig.type} is not supported`);
  }
  delete dbConfig.type;
  return {
    ...dbConfig,
    driver: PostgreSqlDriver,
    entities: [NotificationEntity, TemplateEntity],
  };
};
