import { BadmintonSession, Student } from '../types/session';
import type { CourseType } from '../types/session';

// 学员mock数据
export const mockStudents: Student[] = [
  { id: 'c1', name: '王小明', gender: 'male', birthday: '1997-01-01', level: 2, prePay:0, prePayVoucherId:'v001', paidSessions: [ { sessionId: '1', coupon: -100, voucherId: 'v1001' } ], remark:'' },
  { id: 'c3', name: '张三', gender: 'male', birthday: '1993-03-03', level: 3, prePay:0, prePayVoucherId:'v002', paidSessions: [ { sessionId: '2', coupon: -120, voucherId: 'v1002' } ], remark:'' },
  { id: 'c4', name: '李四', gender: 'male', birthday: '1995-04-04', level: 2, prePay:0, prePayVoucherId:'v003', paidSessions: [ { sessionId: '2', coupon: -120, voucherId: 'v1003' } ], remark:'' },
  { id: 'c5', name: '王五', gender: 'male', birthday: '1989-05-05', level: 2, prePay:0, prePayVoucherId:'v004', paidSessions: [ { sessionId: '3', coupon: -80, voucherId: 'v1004' } ], remark:'' },
  { id: 'c6', name: '赵六', gender: 'male', birthday: '1996-06-06', level: 1, prePay:0, prePayVoucherId:'v005', paidSessions: [ { sessionId: '3', coupon: -80, voucherId: 'v1005' } ], remark:'' },
  { id: 'c7', name: '钱七', gender: 'female', birthday: '1998-07-07', level: 1, prePay:0, prePayVoucherId:'v006', paidSessions: [ { sessionId: '3', coupon: -80, voucherId: 'v1006' } ], remark:'' }
];

export const mockSessions: (Omit<BadmintonSession, 'students'> & { students: string[] })[] = [
  {
    id: '1',
    dateTime: '2025-05-28T14:35:00',
    title: '羽毛球基础入门',
    coach: '李教练',
    sessionType: '一对一' as CourseType,
    equipment: ['球拍', '羽毛球'],
    clientType: '青少年',
    courtName: '中心球场',
    courtNumber: 'A1',
    students: ['c1'],
    totalStudents: 1,
    feePerStudent: 100
  },
  {
    id: '2',
    dateTime: '2025-12-29T09:00:00',
    title: '高级杀球技巧',
    coach: '张教练',
    sessionType: '一对二' as CourseType,
    equipment: ['球拍', '羽毛球', '训练器材'],
    clientType: '青少年',
    courtName: '2号场',
    courtNumber: 'B2',
    students: ['c3', 'c4'],
    totalStudents: 2,
    feePerStudent: 120
  },
  {
    id: '3',
    dateTime: '2025-05-30T18:00:00',
    title: '团体训练课',
    coach: '王教练',
    sessionType: '一对多' as CourseType,
    equipment: ['球拍', '羽毛球', '水'],
    clientType: '青少年',
    courtName: '3号场',
    courtNumber: 'C3',
    students: ['c5', 'c6', 'c7'],
    totalStudents: 3,
    feePerStudent: 80
  }
];

console.log('mockStudents:', mockStudents);
console.log('mockSessions:', mockSessions);
mockSessions.forEach((session) => {
  const studentObjs = session.students.map(id => mockStudents.find(s => s.id === id));
  console.log(`课程[${session.title}]的学员id:`, session.students);
  console.log(`课程[${session.title}]的学员对象:`, studentObjs);
});

mockStudents.forEach(student => {
  console.log(`学员[${student.name}]的收据:`, student.paidSessions);
});