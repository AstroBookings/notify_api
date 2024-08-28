import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventDto } from 'src/api/notification/models/event.dto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/notification/test')
      .expect(200)
      .expect('Hello World!');
  });

  describe('POST /notification', () => {
    it('should send a notification', async () => {
      const inputEvent: EventDto = {
        name: 'launch_scheduled',
        data: 'lnch_2',
      };
      const response = await request(app.getHttpServer())
        .post('/notification')
        .send(inputEvent)
        .expect(201);
      expect(response.body).toHaveLength(1);
      console.log(response.body);
    });
  });
});
