import { BadmintonSession } from '../types/session';
import type { CourseType } from '../types/session';

export const mockSessions: BadmintonSession[] = [
  {
    id: '1',
    title: '羽毛球基础入门',
    coach: '李教练',
    dateTime: new Date().toISOString(),
    sessionType: '一对一' as CourseType,
    equipment: ['球拍', '羽毛球'],
    clientType: '成人',
    courtName: '中心球场',
    courtNumber: 'A1',
    clients: [
      { id: 'c1', name: '王小明', gender: 'male', age: 28, level: 2, attended: true }
    ],
    totalClients: 1
  },
  {
    id: '2',
    title: '高级杀球技巧',
    coach: '张教练',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    sessionType: '一对二' as CourseType,
    equipment: ['球拍', '羽毛球', '训练器材'],
    clientType: '成人',
    courtName: '2号场',
    courtNumber: 'B2',
    clients: [
      { id: 'c3', name: '张三', gender: 'male', age: 32, level: 3, attended: true },
      { id: 'c4', name: '李四', gender: 'male', age: 30, level: 2, attended: true }
    ],
    totalClients: 2
  },
  {
    id: '3',
    title: '团体训练课',
    coach: '王教练',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    sessionType: '一对多' as CourseType,
    equipment: ['球拍', '羽毛球', '水'],
    clientType: '成人',
    courtName: '3号场',
    courtNumber: 'C3',
    clients: [
      { id: 'c5', name: '王五', gender: 'male', age: 35, level: 2, attended: true },
      { id: 'c6', name: '赵六', gender: 'male', age: 28, level: 1, attended: true },
      { id: 'c7', name: '钱七', gender: 'female', age: 26, level: 1, attended: true }
    ],
    totalClients: 3
  }
];