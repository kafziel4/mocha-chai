import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import * as fixtures from '../fixtures';
import * as Types from '../types';

axios.defaults.baseURL = 'https://reqres.in/api';
axios.defaults.validateStatus = (status) => status <= 500;

const oneToThreeDigits = /\d{1,3}/;
const dateInISOFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

describe('ReqRes API', () => {
  it('GET to /users should return status 200 and a list of users', async () => {
    // Act
    const res: AxiosResponse<Types.UserList> = await axios({
      url: '/users',
      method: 'get',
      params: { page: 2 },
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBody = res.data;
    expect(resBody.page).to.equal(2);
    expect(resBody.per_page).to.equal(6);
    expect(resBody.total).to.equal(12);
    expect(resBody.total_pages).to.equal(2);
    expect(resBody.data).to.have.lengthOf(6);

    for (let i = 0; i < fixtures.users.length; i += 1) {
      const resBodyData = resBody.data;
      expect(resBodyData[i].id).to.equal(fixtures.users[i].id);
      expect(resBodyData[i].email).to.equal(fixtures.users[i].email);
      expect(resBodyData[i].first_name).to.equal(fixtures.users[i].first_name);
      expect(resBodyData[i].last_name).to.equal(fixtures.users[i].last_name);
      expect(resBodyData[i].avatar).to.equal(fixtures.users[i].avatar);
    }
  });

  it('GET to /users/id for an existing user should return status 200 and the user data', async () => {
    // Act
    const res: AxiosResponse<Types.SingleUser> = await axios({
      url: '/users/2',
      method: 'get',
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBodyData = res.data.data;
    expect(resBodyData.id).to.equal(2);
    expect(resBodyData.email).to.equal('janet.weaver@reqres.in');
    expect(resBodyData.first_name).to.equal('Janet');
    expect(resBodyData.last_name).to.equal('Weaver');
    expect(resBodyData.avatar).to.equal(
      'https://reqres.in/img/faces/2-image.jpg'
    );
  });

  it('GET to /users/id for a user that does not exist should return status 404', async () => {
    // Act
    const res: AxiosResponse<object> = await axios({
      url: '/users/23',
      method: 'get',
    });

    // Assert
    expect(res.status).to.equal(404);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(res.data).to.be.an('object').that.is.empty;
  });

  it('Get to /colors should return status 200 and a list of colors', async () => {
    // Act
    const res: AxiosResponse<Types.ColorList> = await axios({
      url: '/colors',
      method: 'get',
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBody = res.data;
    expect(resBody.page).to.equal(1);
    expect(resBody.per_page).to.equal(6);
    expect(resBody.total).to.equal(12);
    expect(resBody.total_pages).to.equal(2);
    expect(resBody.data).to.have.lengthOf(6);

    for (let i = 0; i < fixtures.colors.length; i += 1) {
      const resBodyData = resBody.data;
      expect(resBodyData[i].id).to.equal(fixtures.colors[i].id);
      expect(resBodyData[i].name).to.equal(fixtures.colors[i].name);
      expect(resBodyData[i].year).to.equal(fixtures.colors[i].year);
      expect(resBodyData[i].color).to.equal(fixtures.colors[i].color);
      expect(resBodyData[i].pantone_value).to.equal(
        fixtures.colors[i].pantone_value
      );
    }
  });

  it('Get to /colors/id for an existing color should return status 200 and the color data', async () => {
    // Act
    const res: AxiosResponse<Types.SingleColor> = await axios({
      url: '/colors/2',
      method: 'get',
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBodyData = res.data.data;
    expect(resBodyData.id).to.equal(2);
    expect(resBodyData.name).to.equal('fuchsia rose');
    expect(resBodyData.year).to.equal(2001);
    expect(resBodyData.color).to.equal('#C74375');
    expect(resBodyData.pantone_value).to.equal('17-2031');
  });

  it('Get to /colors/id for a color that does not exist should return status 404', async () => {
    // Act
    const res: AxiosResponse<object> = await axios({
      url: '/colors/23',
      method: 'get',
    });

    // Assert
    expect(res.status).to.equal(404);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(res.data).to.be.an('object').that.is.empty;
  });

  it('POST to /users with valid data should return status 201 and the user data', async () => {
    // Arrange
    const reqBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'leader',
    };

    // Act
    const res: AxiosResponse<Types.CreateUserResponse> = await axios({
      url: '/users',
      method: 'post',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(201);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBody = res.data;
    expect(resBody.name).to.equal(reqBody.name);
    expect(resBody.job).to.equal(reqBody.job);
    expect(resBody.id).to.be.a('string').and.match(oneToThreeDigits);
    expect(resBody.createdAt).to.be.a('string').and.match(dateInISOFormat);
  });

  it('PUT to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const reqBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const res: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'put',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBody = res.data;
    expect(resBody.name).to.equal(reqBody.name);
    expect(resBody.job).to.equal(reqBody.job);
    expect(resBody.updatedAt).to.be.a('string').and.match(dateInISOFormat);
  });

  it('PATCH to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const reqBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const res: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'patch',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBody = res.data;
    expect(resBody.name).to.equal(reqBody.name);
    expect(resBody.job).to.equal(reqBody.job);
    expect(resBody.updatedAt).to.be.a('string').and.match(dateInISOFormat);
  });

  it('DELETE to /users/id for an existing user should return status 204', async () => {
    // Act
    const res: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'delete',
    });

    // Assert
    expect(res.status).to.equal(204);

    expect(res.headers['content-length']).to.equal('0');
  });

  it('POST to /register with valid data should return status 200 and the registration id and token', async () => {
    // Arrange
    const reqBody: Types.RegisterOrLoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    // Act
    const res: AxiosResponse<Types.RegisterResponse> = await axios({
      url: '/register',
      method: 'post',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const resBody = res.data;
    expect(resBody.id).to.equal(4);
    expect(resBody.token).to.equal('QpwL5tke4Pnpja7X4');
  });

  it('POST to /register with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const reqBody: Types.RegisterOrLoginRequest = {
      email: 'sydney@fife',
    };

    // Act
    const res: AxiosResponse<Types.ErrorResponse> = await axios({
      url: '/register',
      method: 'post',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(400);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(res.data.error).to.equal('Missing password');
  });

  it('POST to /login with valid data should return status 200 and the login token', async () => {
    // Arrange
    const reqBody: Types.RegisterOrLoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    // Act
    const res: AxiosResponse<Types.LoginResponse> = await axios({
      url: '/login',
      method: 'post',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(200);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(res.data.token).to.equal('QpwL5tke4Pnpja7X4');
  });

  it('POST to /login with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const reqBody: Types.RegisterOrLoginRequest = {
      email: 'peter@klaven',
    };

    // Act
    const res: AxiosResponse<Types.ErrorResponse> = await axios({
      url: '/login',
      method: 'post',
      data: reqBody,
    });

    // Assert
    expect(res.status).to.equal(400);

    expect(res.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(res.data.error).to.equal('Missing password');
  });
});
