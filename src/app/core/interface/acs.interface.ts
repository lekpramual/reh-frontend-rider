export interface AcsList {
  id: number;
  hn: string;
  od_rem: string;
  equip: number;
  equip_name: string;
  wcode_sta: string;
  wcode_staname: string;
  wcode_sto: string;
  wcode_stoname: string;
  go_date: any;
  go_time: string;
  rd_date: any;
  rd_time: string;
  sd_date: any;
  sd_time: string;
  ed_date: any;
  ed_time: string;
  quick: number;
  quick_name: string;
  time_work: number;
  time_workname: string;
  wk_perid: string;
  wk_pername: string;
  admin_wk_perid: string;
  admin_wk_pername: string;
  user_save: string;
  user_ward: number;
  user_wardname: string;
  admin_save: string;
  comment: string;
  status_work: string;
  type_oi: string;
}

export interface AcsGetJobList {
  id: number
  hn: string
  od_rem: string
  equip: number
  equip_name: string
  wcode_sta: string
  wcode_staname: string
  wcode_sto: string
  wcode_stoname: string
  go_date: string
  go_time: string
  quick: number
  quick_name: string
  time_work: number
  time_workname: string
  user_save: string
  user_ward: number
  user_wardname: string
  admin_save: any
  comment: any
  status_work: string
  type_oi: string
}

export type GetAcsListResponse = {
  ok:string,
  result: AcsList[];
}

export type GetAcsGetJobListResponse = {
  ok:string,
  result: AcsGetJobList[];
}
