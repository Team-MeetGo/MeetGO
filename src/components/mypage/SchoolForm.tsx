'use client';

import { emailConfirmAPI, schoolConfirmAPI } from '(@/utils/api/emailConfirmAPI)';
import { useState } from 'react';
import { schoolValidation } from '(@/utils/Validation)';

const SchoolForm = () => {
  const [schoolEmail, setSchoolEmail] = useState('');
  const [univName, setUnivName] = useState('');
  const [validationMessages, setValidationMessages] = useState({
    schoolEmail: '',
    univName: ''
  });
  const [isSchoolValid, setIsSchoolValid] = useState(false);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'schoolEmail') setSchoolEmail(value);
    if (name === 'univName') setUnivName(value);
    const validationResult = schoolValidation(name, value);
    if (typeof validationResult === 'string') {
      // 유효성 검사를 통과하지 못했을 경우, 오류 메시지를 설정합니다.
      setValidationMessages((prev) => ({ ...prev, [name]: validationResult }));
    } else {
      // 유효성 검사를 통과한 경우, 해당 필드의 오류 메시지를 비웁니다.
      setValidationMessages((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmitEmailConfirm = async (schoolEmail: string, univName: string) => {
    if (!schoolEmail || !univName) {
      alert('이메일과 학교명을 모두 입력해주세요.');
      return;
    }
    try {
      const schoolValidationResult = await schoolConfirmAPI(univName);
      if (schoolValidationResult.success) {
        const response = await emailConfirmAPI(schoolEmail, univName, true);
        alert(response.success ? '인증메일 전송 완료' : '인증 실패');
      } else {
        alert('학교명을 다시 확인해주세요.');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="mb-6 flex ">
      <div className="flex flex-col">
        <label className="block text-sm font-medium mb-1" htmlFor="schoolEmail">
          학교 이메일
        </label>
        <input
          className="mr-2 border p-3 rounded-md"
          name="schoolEmail"
          id="schoolEmail"
          type="email"
          value={schoolEmail}
          placeholder=""
          onChange={onChangeInput}
        />
        {validationMessages.schoolEmail && (
          <p className="text-red-500 text-[13px] mt-2">{validationMessages.schoolEmail}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium mb-1" htmlFor="univName">
          학교명
        </label>
        <input
          className="mr-2 border p-3 rounded-md"
          name="univName"
          id="univName"
          type="text"
          value={univName}
          placeholder=""
          onChange={onChangeInput}
        />
        {validationMessages.univName && <p className="text-red-500 text-[13px] mt-2">{validationMessages.univName}</p>}
      </div>
      <button onClick={() => onSubmitEmailConfirm(schoolEmail, univName)}>인증</button>
    </div>
  );
};

export default SchoolForm;
