import { Pagination } from './common';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface SingleUser {
  data: User;
}

export interface UserList extends Pagination {
  data: User[];
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface UpdateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}
