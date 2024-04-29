import { Tables } from '@/types/database.types';
import { Dispatch, SetStateAction } from 'react';

export type UsersType = Tables<'users'>;

export interface IsValidateShow {
  [key: string]: boolean;
}

export interface LoginDataType {
  [key: string]: string;
  userId: string;
  password: string;
}

export type Gender = 'male' | 'female' | '';

export interface JoinDataType {
  userId: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  gender: Gender;
}

export type IsEditingType = {
  isEditing: boolean;
};

export interface UpdateProfileType {
  userId: string;
  inputNickname: string;
  inputIntro: string;
  inputKakaoId: string;
  inputGender: string;
  favorite: string[];
}

export interface FavoriteType {
  selected: Set<string>;
  setSelected: (newSet: Set<string>) => void;
}

export interface UpdateSchoolType {
  userId: string;
  schoolEmail: string;
  univName: string;
}

export interface UpdateAvatarType {
  userId: string;
  file: File;
}

export type UserTypeFromTable = {
  avatar: string | null;
  created_at: string | null;
  favorite: string[] | null;
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

export type NicknameType = Pick<UserTypeFromTable, 'nickname'>;
