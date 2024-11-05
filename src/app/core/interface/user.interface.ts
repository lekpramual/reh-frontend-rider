export interface UserList {
  id:number,
  code: string
  fullname: string
  status: string
  level_name: string
  level_id: number
}

export interface UserListOptions {
  value:number,
  label: string
}

export type GetUserListResponse = {
  result: UserList[];
}
