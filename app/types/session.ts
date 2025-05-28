export type CourseType = '一对一' | '一对二' | '一对多' | '夏令营' | '开放式团课';

export interface Client {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  level: number;
  attended: boolean;
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
  clients: Client[];
  totalClients: number;
  feePerClient: number; // 单人学费
}