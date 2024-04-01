import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

type UserState = {
  user: User | undefined;
};

const userStore = create<UserState>()((set) => ({
  user: undefined
}));
