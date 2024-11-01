export interface User {
  username: string;
  password: string;
}

export interface UserList {
  fullname: string,
  id: string,
  total:number
}

export type GetUserListsResponse = {
  ok:string,
  result: UserList[];
}
