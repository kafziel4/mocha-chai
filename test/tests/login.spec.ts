import { expect } from 'chai';
import { before } from 'mocha';
import { ReqResClient } from '../clients/reqres-client';
import { LoginRequest, LoginResponse } from '../types/login';
import {
  headers,
  jsonContentType,
  missingPassword,
} from '../fixtures/constants';
import { ErrorResponse } from '../types/common';

let reqResClient: ReqResClient;

describe('ReqRes API Login endpoints', () => {
  before(() => {
    reqResClient = new ReqResClient();
  });

  it('POST to /login with valid data should return status 200 and the login token', async () => {
    // Arrange
    const requestBody: LoginRequest = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    const expectedResponse: LoginResponse = {
      token: 'QpwL5tke4Pnpja7X4',
    };

    // Act
    const response = await reqResClient.postLogin(requestBody);

    // Assert
    expect(response.status).to.equal(200);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.equal(expectedResponse);
  });

  it('POST to /login with missing password should return status 400 and the validation error', async () => {
    // Arrange
    const requestBody: LoginRequest = {
      email: 'peter@klaven',
    };

    const expectedResponse: ErrorResponse = {
      error: missingPassword,
    };

    // Act
    const response = await reqResClient.postLogin(requestBody);

    // Assert
    expect(response.status).to.equal(400);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.equal(expectedResponse);
  });
});
