export interface EmpFormSearch {
  emp_start:string;
  emp_end: string;
  emp_role_id: string;
}

export interface WardFormSearch {
  ward_start:string;
  ward_end: string;
  ward_depart: string;
}

export interface ReportEmp {
  id: number
  fullname: string
  "8_9": number
  "9_10": number
  "10_11": number
  "11_12": number
  "12_13": number
  "13_14": number
  "14_15": number
  "15_16": number
  "16_17": number
  "17_18": number
  "18_19": number
  "19_20": number
  "20_21": number
  "21_22": number
  "22_23": number
  "23_24": number
  "24_8": number
}

export type GetReportEmpResponse = {
  result: ReportEmp[];
}

export interface ReportWard {
  ward_id: number
  ward_name: string
  "8_9": number
  "9_10": number
  "10_11": number
  "11_12": number
  "12_13": number
  "13_14": number
  "14_15": number
  "15_16": number
  "16_17": number
  "17_18": number
  "18_19": number
  "19_20": number
  "20_21": number
  "21_22": number
  "22_23": number
  "23_24": number
  "24_8": number
  "total":number
}

export type GetReportWardResponse = {
  result: ReportWard[];
}
