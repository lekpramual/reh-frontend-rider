export interface UserList {
  id:number,
  code: string,
  title: string,
  firstname: string,
  surname: string,
  tel: string,
  username: string,
  status: string,
  level_name: string,
  level_id: number
}



export interface UserListOptions {
  value:number,
  label: string
}

export type GetUserListResponse = {
  result: UserList[];
}


export interface createUser {
  mode:string
  id:string,
  code:string,
  title: string
  firstname: string
  surname: string
  tel: string
  username: string
  password: string
  level_id: string
}
