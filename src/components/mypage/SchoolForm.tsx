'use client';

import { emailCodeAPI, emailConfirmAPI, schoolConfirmAPI } from '(@/utils/api/emailConfirmAPI)';
import { useState } from 'react';
import { schoolValidation } from '(@/utils/Validation)';

const SchoolForm = () => {
  const [schoolEmail, setSchoolEmail] = useState('');
  const [univName, setUnivName] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [validationMessages, setValidationMessages] = useState({
    schoolEmail: '',
    univName: ''
  });

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

  const onSubmitEmailConfirm = async () => {
    if (!schoolEmail || !univName) {
      alert('이메일과 학교명을 모두 입력해주세요.');
      return;
    }

    // 학교명 유효성 검사
    try {
      const schoolValidationResult = await schoolConfirmAPI(univName);
      if (!schoolValidationResult.success) {
        alert('학교명을 다시 확인해주세요.');
        return;
      }

      // 학교명이 유효한 경우, 인증 메일 발송
      const emailConfirmResult = await emailConfirmAPI(schoolEmail, univName, true);
      if (emailConfirmResult.success) {
        alert('인증메일 전송 완료');
        setIsCodeSent(true); // 인증 메일 발송 성공 상태를 true로 변경
      } else {
        alert('인증 실패');
        setIsCodeSent(false);
      }
    } catch (error: any) {
      console.error(error);
      alert('인증 과정 중 오류가 발생했습니다.');
    }
  };

  const onSubmitCodeConfirm = async () => {
    try {
      const response = await emailCodeAPI(schoolEmail, univName, Number(code));
      if (response.success) {
        setIsCodeValid(true); // 인증 코드 유효성 검사 결과 상태 업데이트
        alert('인증 완료');
        setIsCodeSent(false); // 인증 완료했으니 코드입력창 다시 없애기
        //  DB의 isValidata 상태 업데이트 로직 구현해야함
      } else {
        setIsCodeValid(false);
        alert('인증 코드가 유효하지 않습니다.');
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
      <button onClick={onSubmitEmailConfirm} disabled={isCodeSent}>
        인증
      </button>
      <p>인증완료✔️</p>
      {isCodeSent && (
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1" htmlFor="schoolEmail">
            인증 코드
          </label>
          <div>
            <input
              className="mr-2 border p-3 rounded-md"
              name="code"
              type="text"
              placeholder=""
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={onSubmitCodeConfirm}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolForm;