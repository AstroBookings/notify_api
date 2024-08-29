import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventDto } from 'src/api/notification/models/event.dto';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { AppModule } from '../src/app.module';

describe('Notification Controller (e2e)', () => {
  let app: INestApplication;
  let req: TestAgent;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    req = request(app.getHttpServer());
  });
  it('/ (GET)', async () => {
    await req.get('/api/notification/test').expect(200).expect('Hello World!');
  });

  describe('POST /notification', () => {
    it('should save a launch_scheduled notification event', async () => {
      const inputEvent: EventDto = {
        name: 'launch_scheduled',
        data: 'lnch_2',
      };
      const response = await req.post('/api/notification').send(inputEvent).expect(201);
      expect(response.body).toHaveLength(1);
      console.log(response.body);
    });
    it('should save a booking_confirmed notification event', async () => {
      const inputEvent: EventDto = {
        name: 'booking_confirmed',
        data: 'bkg_1',
      };
      const response = await req.post('/api/notification').send(inputEvent).expect(201);
      expect(response.body).toHaveLength(1);
      console.log(response.body);
    });
    it('should save an invoice_issued notification event', async () => {
      const inputEvent: EventDto = {
        name: 'invoice_issued',
        data: 'inv_1',
      };
      const response = await req.post('/api/notification').send(inputEvent).expect(201);
      console.log(response.body);
    });
    it('should not send, yet, a booking_canceled notification event', async () => {
      const inputEvent: EventDto = {
        name: 'booking_canceled',
        data: 'not_existing_event',
      };
      const response = await req.post('/api/notification').send(inputEvent).expect(404);
      expect(response.body.message).toBe(`Template not found for event: ${inputEvent.name}`);
    });
  });

  describe('GET /notification/pending', () => {
    it('should return all pending notifications', async () => {
      // Arrange
      const inputEvents: EventDto[] = [
        { name: 'launch_scheduled', data: 'lnch_1' },
        { name: 'booking_confirmed', data: 'bkg_1' },
      ];

      for (const event of inputEvents) {
        await req.post('/api/notification').send(event).expect(201);
      }

      // Act
      const actualResponse = await req.get('/api/notification/pending').expect(200);

      // Assert
      expect(Array.isArray(actualResponse.body)).toBe(true);
      expect(actualResponse.body.length).toBeGreaterThanOrEqual(2);

      actualResponse.body.forEach((notification: any) => {
        expect(notification).toHaveProperty('id');
        expect(notification).toHaveProperty('userId');
        expect(notification).toHaveProperty('subject');
        expect(notification).toHaveProperty('message');
      });
    });
  });

  describe('POST /notification/:id/send', () => {
    let inputNotificationId: string;
    beforeEach(async () => {
      const inputEvent: EventDto = { name: 'launch_scheduled', data: 'lnch_2' };

      const response = await req.post('/api/notification').send(inputEvent).expect(201);
      inputNotificationId = response.body[0].id;
    });
    it('should send a notification', async () => {
      // Act
      const actualResponse = await req.post(`/api/notification/${inputNotificationId}/send`).expect(200);

      // Assert
      expect(actualResponse.body).toHaveProperty('status');
      expect(actualResponse.body.status).toBe('sent');
    });
  });
});
