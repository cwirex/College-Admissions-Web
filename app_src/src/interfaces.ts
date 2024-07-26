export interface IdName {
  id: string;
  name: string;
}

export interface ICollege {
  id: string;
  name: string;
  courses: Array<ICourse>;
}

export interface ICourse {
  id: string;
  name: string;
  capacity?: number;
  enrolled?: number;
  desc?: string;
  multipliers?: Array<IMultiScore>;
  candidates?: Map<string, number>;
}

export interface IMultiScore {
  id: string;
  name: string;
  basic: number;
  advanced: number;
}

export interface IPreference {
  id: string;
  pos: number;
  university: string;
  course: string;
  enrolled: number | string;
  capacity: number | string;
  universityId?: string;
  courseId?: string;
  rank?: number;
}

export interface IResults {
  status: EResults;
  university?: string;
  course?: string;
  courseId?: string;
  universityId?: string;
  courses?: ICourse[];
}

export interface IRegister {
  email: string;
  pesel: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export enum EResults {
  NotReady = 0,
  Success = 1,
  Fail = 2,
}

export enum ERoles {
  None,
  Student,
  College,
}
