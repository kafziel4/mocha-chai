import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ColorList, SingleColor } from '../types/colors';
import { ErrorResponse } from '../types/common';
import { LoginRequest, LoginResponse } from '../types/login';
import { RegisterRequest, RegisterResponse } from '../types/register';
import {
  CreateUserRequest,
  CreateUserResponse,
  SingleUser,
  UpdateUserRequest,
  UpdateUserResponse,
  UserList,
} from '../types/users';

export class ReqResClient {
  private static readonly usersPath = '/users';
  private static readonly colorsPath = '/colors';
  private static readonly registerPath = '/register';
  private static readonly loginPath = '/login';
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'https://reqres.in/api',
      validateStatus: (status) => status <= 500,
    });
  }

  async getUsers(page: number): Promise<AxiosResponse<UserList>> {
    return await this.httpClient.get(ReqResClient.usersPath, {
      params: { page },
    });
  }

  async getSingleUser(id: number): Promise<AxiosResponse<SingleUser>> {
    return await this.httpClient.get(`${ReqResClient.usersPath}/${id}`);
  }

  async postUser(
    body: CreateUserRequest
  ): Promise<AxiosResponse<CreateUserResponse>> {
    return await this.httpClient.post(ReqResClient.usersPath, body);
  }

  async putUser(
    id: number,
    body: UpdateUserRequest
  ): Promise<AxiosResponse<UpdateUserResponse>> {
    return await this.httpClient.put(`${ReqResClient.usersPath}/${id}`, body);
  }

  async patchUser(
    id: number,
    body: UpdateUserRequest
  ): Promise<AxiosResponse<UpdateUserResponse>> {
    return await this.httpClient.patch(`${ReqResClient.usersPath}/${id}`, body);
  }

  async deleteUser(id: number): Promise<AxiosResponse<string>> {
    return await this.httpClient.delete(`${ReqResClient.usersPath}/${id}`);
  }

  async getColors(): Promise<AxiosResponse<ColorList>> {
    return await this.httpClient.get(ReqResClient.colorsPath);
  }

  async getSingleColor(id: number): Promise<AxiosResponse<SingleColor>> {
    return await this.httpClient.get(`${ReqResClient.colorsPath}/${id}`);
  }

  async postRegister(
    body: RegisterRequest
  ): Promise<AxiosResponse<RegisterResponse> | AxiosResponse<ErrorResponse>> {
    return await this.httpClient.post(ReqResClient.registerPath, body);
  }

  async postLogin(
    body: LoginRequest
  ): Promise<AxiosResponse<LoginResponse> | AxiosResponse<ErrorResponse>> {
    return await this.httpClient.post(ReqResClient.loginPath, body);
  }
}
