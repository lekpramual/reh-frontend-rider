export interface WardList {
  ward_id:string;
  ward_name: string;
  ward_status_id: string;
  ward_status_name: string;
  ward_date:string;
}

export interface WardCreate {
  ward_id:string;
  ward_name: string;
  ward_status: string;
}

export type GetWardsResponse = {
  result: WardList[];
}

export interface WardListNew {
  ward_id: string
  ward_name: string
  ward_status: string
  ward_created_at: string
}

export type GetWardListResponse = {
  result: WardListNew[];
}

export interface WardCreate {
  mode:string
  ward_id: string
  ward_name: string
  ward_status: string
}

export interface WardCreateForm {
  ward_name: string
  ward_status: string
}
