export type CourseType = '一对一' | '一对二' | '一对多' | '夏令营' | '开放式团课';

export interface Receipt {
  sessionId: string;
  coupon: number;
  voucherId: string;
}

export interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthday: string;
  level: number;
  prePay: number;
  prePayVoucherId: string;
  paidSessions: Receipt[];
  remark: string;
}

export interface BadmintonSession {
  id: string;
  title: string;
  coach: string;
  dateTime: string;
  sessionType: CourseType;
  equipment: string[];
  clientType: '青少年' | '成人';
  courtName: string;
  courtNumber: string;
  students:string[];
  totalStudents: number;
  feePerStudent: number; // 单人学费
}