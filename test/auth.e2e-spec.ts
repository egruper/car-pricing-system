import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const testEmail = 'unique2@gmail.com';

    return request(app.getHttpServer())
      // Create a POST request
      .post('/auth/signup')
      // Add info to the body of the request
      .send({ email: testEmail, password: 'pass' })
      // 201 (CREATED) is returned from signup
      .expect(201)
      // responseObj will contain the body property with data 
      .then((responseObj) => {
          const { id, email } = responseObj.body;
          expect(id).toBeDefined();
          expect(email).toEqual(testEmail);
      });
  });

  it('signup as a new user then get currently logged user', async () => {
	  const email = "newEmail@test.com";

	  const res = await request(app.getHttpServer())
	  	  .post('/auth/signup')
		  .send({email, password: '1234'})
		  .expect(201);
	  // We use the super-agent library here (request/response funcs) and this lib
	  // doesn't handle cookies by default, so we need to manually save it.
	  // 'Set-Cookie' is the cookie's header.
	  const cookie = res.get('Set-Cookie');

	  const { body } = await request(app.getHttpServer())
	  	  .get('/auth/whoami')
		  .set('Cookie', cookie)
		  .expect(200);

	  expect(body.email).toEqual(email);

  });
});
