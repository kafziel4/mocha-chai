import { expect } from 'chai';
import { before } from 'mocha';
import { ReqResClient } from '../clients/reqres-client';
import {
  dateInISOFormat,
  headers,
  jsonContentType,
  oneToThreeDigits,
} from '../fixtures/constants';
import { users } from '../fixtures/users';
import {
  CreateUserRequest,
  SingleUser,
  UpdateUserRequest,
  UserList,
} from '../types/users';

let reqResClient: ReqResClient;

describe('ReqRes API Users endpoints', () => {
  before(() => {
    reqResClient = new ReqResClient();
  });

  it('GET to /users should return status 200 and a list of users', async () => {
    // Arrange
    const page = 2;
    const expectedResponse: UserList = users;

    // Act
    const response = await reqResClient.getUsers(page);

    // Assert
    expect(response.status).to.equal(200);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.include(expectedResponse);
  });

  it('GET to /users/id for an existing user should return status 200 and the user data', async () => {
    // Arrange
    const expectedResponse: SingleUser = {
      data: {
        id: 2,
        email: 'janet.weaver@reqres.in',
        first_name: 'Janet',
        last_name: 'Weaver',
        avatar: 'https://reqres.in/img/faces/2-image.jpg',
      },
    };

    // Act
    const response = await reqResClient.getSingleUser(expectedResponse.data.id);

    // Assert
    expect(response.status).to.equal(200);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.include(expectedResponse);
  });

  it('GET to /users/id for a user that does not exist should return status 404', async () => {
    // Arrange
    const nonexistentId = 23;

    // Act
    const response = await reqResClient.getSingleUser(nonexistentId);

    // Assert
    expect(response.status).to.equal(404);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.be.an('object').that.is.empty;
  });

  it('POST to /users with valid data should return status 201 and the user data', async () => {
    // Arrange
    const requestBody: CreateUserRequest = {
      name: 'morpheus',
      job: 'leader',
    };

    // Act
    const response = await reqResClient.postUser(requestBody);

    // Assert
    expect(response.status).to.equal(201);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.include(requestBody);
    expect(response.data.id).to.match(oneToThreeDigits);
    expect(response.data.createdAt).to.match(dateInISOFormat);
  });

  it('PUT to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const id = 2;
    const requestBody: UpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const response = await reqResClient.putUser(id, requestBody);

    // Assert
    expect(response.status).to.equal(200);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.include(requestBody);
    expect(response.data.updatedAt).to.match(dateInISOFormat);
  });

  it('PATCH to /users/id for an existing user with valid data should return status 200 and the user data', async () => {
    // Arrange
    const id = 2;
    const requestBody: UpdateUserRequest = {
      name: 'morpheus',
      job: 'zion resident',
    };

    // Act
    const response = await reqResClient.patchUser(id, requestBody);

    // Assert
    expect(response.status).to.equal(200);
    expect(response.headers[headers.contentType]).to.equal(jsonContentType);
    expect(response.data).to.deep.include(requestBody);
    expect(response.data.updatedAt).to.match(dateInISOFormat);
  });

  it('DELETE to /users/id for an existing user should return status 204', async () => {
    // Arrange
    const id = 2;

    // Act
    const response = await reqResClient.deleteUser(id);

    // Assert
    expect(response.status).to.equal(204);
    expect(response.headers[headers.contentLength]).to.equal('0');
  });
});
