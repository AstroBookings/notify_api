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
    it('should send a launch_scheduled notification event', async () => {
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
    it('should send a booking_confirmed notification event', async () => {
      const inputEvent: EventDto = {
        name: 'booking_confirmed',
        data: 'bkg_1',
      };
      const response = await request(app.getHttpServer())
        .post('/notification')
        .send(inputEvent)
        .expect(201);
      expect(response.body).toHaveLength(1);
      console.log(response.body);
    });
    it('should not send a invoice_issued notification event', async () => {
      const inputEvent: EventDto = {
        name: 'invoice_issued',
        data: 'inv_1',
      };
      const response = await request(app.getHttpServer())
        .post('/notification')
        .send(inputEvent)
        .expect(404);
      expect(response.body.message).toBe(
        `Template not found for event: ${inputEvent.name}`,
      );
    });
  });
});
