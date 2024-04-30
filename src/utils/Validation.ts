export const authValidation = (name: string, value: string, confirmPassword?: string): boolean => {
  switch (name) {
    case 'userId':
      const idReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return idReg.test(value);
    case 'password':
      const passwordReg = /^(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[^\s]{8,}$/;
      return passwordReg.test(value);
    case 'confirmPassword':
      return value === confirmPassword;
    case 'nickname':
      if (value.length >= 2 && value.length <= 12) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
};

export const schoolValidation = (name: string, value: string): string | boolean => {
  switch (name) {
    case 'schoolEmail': {
      const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailValid = emailReg.test(value);
      const isAcKrDomain = value.endsWith('.ac.kr');

      if (!isEmailValid) return '이메일 형식이 아닙니다.';
      if (!isAcKrDomain) return '대학교 이메일을 입력해주세요.';
      return true;
    }
    case 'schoolName': {
      const univNameReg = value.endsWith('대학교');
      if (!univNameReg) return '학교 이름은 "대학교"로 끝나야합니다.';
      return true;
    }
    default:
      return false;
  }
};
