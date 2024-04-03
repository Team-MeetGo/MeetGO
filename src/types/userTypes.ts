export interface IsValidateShow {
  [key: string]: boolean;
}

export interface LoginData {
  userId: string;
  password: string;
}

export type UserDataFromTable = {
  avatar: string | null;
  favorite: string | null;
  gender: string | null;
  intro: string | null;
  isValidate: boolean;
  kakaoId: string | null;
  login_email: string;
  nickname: string | null;
  school_email: string | null;
  school_name: string | null;
  user_id: string;
};
