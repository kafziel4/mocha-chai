interface List {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface UserList extends List {
  data: UserData[];
}

export interface SingleUser {
  data: UserData;
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ColorList extends List {
  data: ColorData[];
}

export interface SingleColor {
  data: ColorData;
}

export interface ColorData {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export interface CreateOrUpdateUserRequest {
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

export interface RegisterOrLoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse extends LoginResponse {
  id: number;
}

export interface ErrorResponse {
  error: string;
}
