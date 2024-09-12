import { EventDto } from '@api/notification/models/event.dto';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import * as request from 'supertest';

describe('Notification Controller (e2e)', () => {
  let app: INestApplication;
  let apiKey: string;
  const notificationEndPoint: string = '/api/notification';
  const adminEndPoint: string = '/api/admin';
  const authEndpoint = 'http://localhost:3000/api/authentication';
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
  const inputRegisterUser = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    password: 'Password@1',
    role: 'traveler',
  };
  const inputLoginUser = {
    email: 'john.doe@email.com',
    password: 'Password@1',
  };

  beforeAll(async () => {
    // Arrange

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(console)
      .compile();

    app = moduleFixture.createNestApplication();
    const configService = app.get(ConfigService);
    apiKey = configService.get<string>('API_KEY');

    if (!apiKey) {
      throw new Error('API_KEY is not configured in the environment');
    }
    await app.init();

    // Act
    await request(app.getHttpServer())
      .post(`${adminEndPoint}/regenerate-db`)
      .set('X-API-Key', apiKey)
      .expect(200)
      .expect((response) => {
        // Assert
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Database regenerated successfully');
      });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /notification/ping', () => {
    it('should return pong', () => {
      // Arrange
      const pingUrl = `${notificationEndPoint}/ping`;

      // Act & Assert
      return request(app.getHttpServer()).get(pingUrl).expect(200).expect('pong');
    });
  });

  describe('POST /notification', () => {
    it('should save a launch_scheduled notification event', () => {
      // Arrange
      const url = notificationEndPoint;

      // Act & Assert
      return request(app.getHttpServer())
        .post(url)
        .send(inputLaunchEvent)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveLength(1);
        });
    });

    it('should save a booking_confirmed notification event', () => {
      // Arrange
      const url = notificationEndPoint;

      // Act & Assert
      return request(app.getHttpServer())
        .post(url)
        .send(inputBookingEvent)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveLength(1);
        });
    });

    it('should save an invoice_issued notification event', () => {
      // Arrange
      const url = notificationEndPoint;

      // Act & Assert
      return request(app.getHttpServer()).post(url).send(inputInvoiceEvent).expect(201);
    });

    it('should not send, yet, a booking_canceled notification event', () => {
      // Arrange
      const url = notificationEndPoint;

      // Act & Assert
      return request(app.getHttpServer())
        .post(url)
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
      // Arrange
      const response = await request(app.getHttpServer()).post(notificationEndPoint).send(inputLaunchEvent).expect(201);
      inputNotificationId = response.body[0].id;
    });

    it('should send a notification', () => {
      // Arrange
      const url = `${notificationEndPoint}/${inputNotificationId}/send`;

      // Act & Assert
      return request(app.getHttpServer())
        .post(url)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('status');
          expect(response.body.status).toBe('sent');
        });
    });
  });

  describe('GET /notification/pending', () => {
    beforeEach(async () => {
      // Arrange
      await request(app.getHttpServer()).post(notificationEndPoint).send(inputLaunchEvent).expect(201);
      await request(app.getHttpServer()).post(notificationEndPoint).send(inputBookingEvent).expect(201);
    });

    it('should return all pending notifications', () => {
      // Arrange
      const url = `${notificationEndPoint}/pending`;

      // Act & Assert
      return request(app.getHttpServer())
        .get(url)
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
      // Arrange
      await request(app.getHttpServer()).post(notificationEndPoint).send(inputLaunchEvent).expect(201);
      await request(app.getHttpServer()).post(notificationEndPoint).send(inputBookingEvent).expect(201);
      try {
        const loginResponse = await request(authEndpoint).post('/login').send(inputLoginUser);
        token = loginResponse.body.token;
      } catch (error) {
        const registerResponse = await request(authEndpoint).post('/register').send(inputRegisterUser);
        token = registerResponse.body.token;
      }
    });

    it('should return all pending notifications for a user', () => {
      // Arrange
      const url = `${notificationEndPoint}/user/pending`;

      // Act & Assert
      return request(app.getHttpServer())
        .get(url)
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
