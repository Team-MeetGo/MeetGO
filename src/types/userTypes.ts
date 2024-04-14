import { Tables } from '(@/types/database.types)';
import { Dispatch, SetStateAction } from 'react';

export type UsersType = Tables<'users'>;

export interface IsValidateShow {
  [key: string]: boolean;
}

export interface LoginData {
  userId: string;
  password: string;
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
