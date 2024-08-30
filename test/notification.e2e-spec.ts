import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventDto } from 'src/api/notification/models/event.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Notification Controller (e2e)', () => {
  let app: INestApplication;
  let endPoint: string = '/api/notification';
  const inputLaunchEvent: EventDto = {
    name: 'launch_scheduled',
    data: 'lnch_2',
  };
  const inputBookingEvent: EventDto = {
    name: 'booking_confirmed',
    data: 'bkg_1',
  };
  const inputInvoiceEvent: EventDto = {
    name: 'invoice_issued',
    data: 'inv_1',
  };
  const inputInvalidEvent: EventDto = {
    name: 'booking_canceled',
    data: 'not_existing_event',
  };
  const authEndpoint = 'http://localhost:3000/api/authentication';
  const inputRegisterUser = {
    name: 'John Doe',
    email: 'john.doe@test.dev',
    password: 'Password@123',
    role: 'traveler',
  };
  const inputLoginUser = {
    email: 'john.doe@test.dev',
    password: 'Password@123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Regenerate the database before all tests
    await request(app.getHttpServer())
      .post('/api/admin/regenerate-db')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Database regenerated successfully');
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get(`${endPoint}/test`).expect(200).expect('Hello World!');
  });

  describe('POST /notification', () => {
    it('should save a launch_scheduled notification event', () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .send(inputLaunchEvent)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveLength(1);
        });
    });

    it('should save a booking_confirmed notification event', () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .send(inputBookingEvent)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveLength(1);
        });
    });

    it('should save an invoice_issued notification event', () => {
      return request(app.getHttpServer()).post(endPoint).send(inputInvoiceEvent).expect(201);
    });

    it('should not send, yet, a booking_canceled notification event', () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .send(inputInvalidEvent)
        .expect(404)
        .expect((response) => {
          expect(response.body.message).toBe(`Template not found for event: ${inputInvalidEvent.name}`);
        });
    });
  });

  describe('POST /notification/:id/send', () => {
    let inputNotificationId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer()).post(endPoint).send(inputLaunchEvent).expect(201);
      inputNotificationId = response.body[0].id;
    });

    it('should send a notification', () => {
      return request(app.getHttpServer())
        .post(`${endPoint}/${inputNotificationId}/send`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('status');
          expect(response.body.status).toBe('sent');
        });
    });
  });

  describe('GET /notification/pending', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post(endPoint).send(inputLaunchEvent).expect(201);
      await request(app.getHttpServer()).post(endPoint).send(inputBookingEvent).expect(201);
    });

    it('should return all pending notifications', () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/pending`)
        .expect(200)
        .expect((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThanOrEqual(2);
          response.body.forEach((notification: any) => {
            expect(notification).toHaveProperty('id');
            expect(notification).toHaveProperty('userId');
            expect(notification).toHaveProperty('subject');
            expect(notification).toHaveProperty('message');
          });
        });
    });
  });

  describe('GET /notification/user/pending', () => {
    let token: string;

    beforeEach(async () => {
      await request(app.getHttpServer()).post(endPoint).send(inputLaunchEvent).expect(201);
      await request(app.getHttpServer()).post(endPoint).send(inputBookingEvent).expect(201);

      try {
        const loginResponse = await request(authEndpoint).post('/login').send(inputLoginUser);
        token = loginResponse.body.token;
      } catch (error) {
        const registerResponse = await request(authEndpoint).post('/register').send(inputRegisterUser);
        token = registerResponse.body.token;
      }
    });

    it('should return all pending notifications for a user', () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/user/pending`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          console.log(response.body);
          if (response.body.length > 0) {
            const userId = response.body[0].userId;
            response.body.forEach((notification: any) => {
              expect(notification).toHaveProperty('userId', userId);
              expect(notification).toHaveProperty('status', 'pending');
            });
          }
        });
    });
  });
});
