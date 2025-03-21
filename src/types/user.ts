export interface IUser {
  index: number;
  id: string;
  // username: string;
  email: string;
  mobile_number: string;
  nickname: string;
  fullname: string;
  dob: string;
  gender:string;
  role: string;
  banned: boolean;
}

export type TGetListUser = { limit?: number; page?: number };
