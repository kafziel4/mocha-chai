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
    const response: AxiosResponse<Types.UserList> = await axios({
      url: '/users',
      method: 'get',
      params: { page: 2 },
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.page).to.equal(2);
    expect(responseBody.per_page).to.equal(6);
    expect(responseBody.total).to.equal(12);
    expect(responseBody.total_pages).to.equal(2);
    expect(responseBody.data).to.have.lengthOf(6);

    for (let i = 0; i < fixtures.users.length; i += 1) {
      const responseUsersData = responseBody.data;
      expect(responseUsersData[i].id).to.equal(fixtures.users[i].id);
      expect(responseUsersData[i].email).to.equal(fixtures.users[i].email);
      expect(responseUsersData[i].first_name).to.equal(
        fixtures.users[i].first_name
      );
      expect(responseUsersData[i].last_name).to.equal(
        fixtures.users[i].last_name
      );
      expect(responseUsersData[i].avatar).to.equal(fixtures.users[i].avatar);
    }
  });

  it('GET to /users/id for an existing user should return status 200 and the user data', async () => {
    // Act
    const response: AxiosResponse<Types.SingleUser> = await axios({
      url: '/users/2',
      method: 'get',
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseUserData = response.data.data;
    expect(responseUserData.id).to.equal(2);
    expect(responseUserData.email).to.equal('janet.weaver@reqres.in');
    expect(responseUserData.first_name).to.equal('Janet');
    expect(responseUserData.last_name).to.equal('Weaver');
    expect(responseUserData.avatar).to.equal(
      'https://reqres.in/img/faces/2-image.jpg'
    );
  });

  it('GET to /users/id for a user that does not exist should return status 404', async () => {
    // Act
    const response: AxiosResponse<object> = await axios({
      url: '/users/23',
      method: 'get',
    });

    // Assert
    expect(response.status).to.equal(404);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(response.data).to.be.an('object').that.is.empty;
  });

  it('Get to /colors should return status 200 and a list of colors', async () => {
    // Act
    const response: AxiosResponse<Types.ColorList> = await axios({
      url: '/colors',
      method: 'get',
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.page).to.equal(1);
    expect(responseBody.per_page).to.equal(6);
    expect(responseBody.total).to.equal(12);
    expect(responseBody.total_pages).to.equal(2);
    expect(responseBody.data).to.have.lengthOf(6);

    for (let i = 0; i < fixtures.colors.length; i += 1) {
      const responseColorsData = responseBody.data;
      expect(responseColorsData[i].id).to.equal(fixtures.colors[i].id);
      expect(responseColorsData[i].name).to.equal(fixtures.colors[i].name);
      expect(responseColorsData[i].year).to.equal(fixtures.colors[i].year);
      expect(responseColorsData[i].color).to.equal(fixtures.colors[i].color);
      expect(responseColorsData[i].pantone_value).to.equal(
        fixtures.colors[i].pantone_value
      );
    }
  });

  it('Get to /colors/id for an existing color should return status 200 and the color data', async () => {
    // Act
    const response: AxiosResponse<Types.SingleColor> = await axios({
      url: '/colors/2',
      method: 'get',
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseColorData = response.data.data;
    expect(responseColorData.id).to.equal(2);
    expect(responseColorData.name).to.equal('fuchsia rose');
    expect(responseColorData.year).to.equal(2001);
    expect(responseColorData.color).to.equal('#C74375');
    expect(responseColorData.pantone_value).to.equal('17-2031');
  });

  it('Get to /colors/id for a color that does not exist should return status 404', async () => {
    // Act
    const response: AxiosResponse<object> = await axios({
      url: '/colors/23',
      method: 'get',
    });

    // Assert
    expect(response.status).to.equal(404);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(response.data).to.be.an('object').that.is.empty;
  });

  it('POST to /users with valid data should return status 201 and the user data', async () => {
    // Arrange
    const requestBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'leader',
    };

    // Act
    const response: AxiosResponse<Types.CreateUserResponse> = await axios({
      url: '/users',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(201);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.name).to.equal(requestBody.name);
    expect(responseBody.job).to.equal(requestBody.job);
    expect(responseBody.id).to.be.a('string').and.match(oneToThreeDigits);
    expect(responseBody.createdAt).to.be.a('string').and.match(dateInISOFormat);
  });

  it('PUT to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const requestBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const response: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'put',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.name).to.equal(requestBody.name);
    expect(responseBody.job).to.equal(requestBody.job);
    expect(responseBody.updatedAt).to.be.a('string').and.match(dateInISOFormat);
  });

  it('PATCH to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const requestBody: Types.CreateOrUpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const response: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'patch',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.name).to.equal(requestBody.name);
    expect(responseBody.job).to.equal(requestBody.job);
    expect(responseBody.updatedAt).to.be.a('string').and.match(dateInISOFormat);
  });

  it('DELETE to /users/id for an existing user should return status 204', async () => {
    // Act
    const response: AxiosResponse<Types.UpdateUserResponse> = await axios({
      url: '/users/2',
      method: 'delete',
    });

    // Assert
    expect(response.status).to.equal(204);

    expect(response.headers['content-length']).to.equal('0');
  });

  it('POST to /register with valid data should return status 200 and the registration id and token', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    // Act
    const response: AxiosResponse<Types.RegisterResponse> = await axios({
      url: '/register',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    const responseBody = response.data;
    expect(responseBody.id).to.equal(4);
    expect(responseBody.token).to.equal('QpwL5tke4Pnpja7X4');
  });

  it('POST to /register with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'sydney@fife',
    };

    // Act
    const response: AxiosResponse<Types.ErrorResponse> = await axios({
      url: '/register',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(400);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(response.data.error).to.equal('Missing password');
  });

  it('POST to /login with valid data should return status 200 and the login token', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    // Act
    const response: AxiosResponse<Types.LoginResponse> = await axios({
      url: '/login',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(response.data.token).to.equal('QpwL5tke4Pnpja7X4');
  });

  it('POST to /login with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: Types.RegisterOrLoginRequest = {
      email: 'peter@klaven',
    };

    // Act
    const response: AxiosResponse<Types.ErrorResponse> = await axios({
      url: '/login',
      method: 'post',
      data: requestBody,
    });

    // Assert
    expect(response.status).to.equal(400);

    expect(response.headers['content-type']).to.equal(
      'application/json; charset=utf-8'
    );

    expect(response.data.error).to.equal('Missing password');
  });
});
