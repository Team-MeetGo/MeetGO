'use client';

import { emailCodeAPI, emailConfirmAPI, schoolConfirmAPI } from '@/utils/api/emailConfirmAPI';
import { useState } from 'react';
import { schoolValidation } from '@/utils/Validation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useQueryClient } from '@tanstack/react-query';
import { useSchoolUpdateMutation } from '@/hooks/useMutation/useSchoolMutation';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import { customErrToast, customSuccessToast } from '../common/customToast';
import { FaCheckSquare } from 'react-icons/fa';

const SchoolForm = () => {
  const queryClient = useQueryClient();
  const [schoolEmail, setSchoolEmail] = useState('');
  const [univName, setUnivName] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [validationMessages, setValidationMessages] = useState({
    schoolEmail: '',
    univName: ''
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: user } = useGetUserDataQuery();
  const { mutate: updateSchoolMutate } = useSchoolUpdateMutation();

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

  /**인증메일 보내는 로직 */
  const onSubmitEmailConfirm = async () => {
    if (!schoolEmail || !univName) {
      customErrToast('이메일과 학교명을 모두 입력해주세요.');
      return;
    }

    // 학교명 유효성 검사
    try {
      const schoolValidationResult = await schoolConfirmAPI(univName);
      if (!schoolValidationResult.success) {
        customErrToast('학교명을 다시 확인해주세요.');
        return;
      }

      // 학교명이 유효한 경우, 인증 메일 발송
      const emailConfirmResult = await emailConfirmAPI(schoolEmail, univName, true);
      if (emailConfirmResult.success) {
        onOpen();
        customSuccessToast('인증메일 전송 완료');
        setIsCodeSent(true); // 인증 메일 발송 성공 상태를 true로 변경
      } else {
        customErrToast('인증 실패');
        setIsCodeSent(false);
      }
    } catch (error) {
      console.error(error);
      customErrToast('인증 과정 중 오류가 발생했습니다.');
    }
  };

  /**인증코드 확인하는 로직 */
  const onSubmitCodeConfirm = async () => {
    try {
      const response = await emailCodeAPI(schoolEmail, univName, Number(code));
      if (response.success) {
        customSuccessToast('인증 완료');
        onOpenChange();
        updateSchoolMutate(
          { userId: user!.user_id, schoolEmail, univName },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: [USER_DATA_QUERY_KEY]
              });
            }
          }
        );
      } else {
        customErrToast('인증 코드가 유효하지 않습니다.');
      }
    } catch (error) {
      customErrToast('인증 과정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <label className="block text-lg font-semibold w-[100px]" htmlFor="schoolEmail">
          학교 이메일
        </label>
        {user?.isValidate ? (
          <p>{user?.school_email}</p>
        ) : (
          <div className="flex items-center">
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
        )}
      </div>
      <div className="flex gap-6 items-center">
        <label className="block text-lg font-semibold w-[100px]" htmlFor="univName">
          학교명
        </label>
        {user?.isValidate ? (
          <p>{user?.school_name}</p>
        ) : (
          <div className="flex items-center">
            <input
              className="mr-2 border p-3 rounded-md"
              name="univName"
              id="univName"
              type="text"
              value={univName}
              placeholder=""
              onChange={onChangeInput}
            />
            {validationMessages.univName && (
              <p className="text-red-500 text-[13px] mt-2">{validationMessages.univName}</p>
            )}
          </div>
        )}
        {user?.isValidate ? (
          <FaCheckSquare color="#006FEE" />
        ) : (
          <button className="text-sm border px-4 py-2 rounded-lg" onClick={onSubmitEmailConfirm} disabled={isCodeSent}>
            인증
          </button>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">학교 이메일 인증코드</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Code"
                  placeholder="인증코드를 입력해주세요"
                  variant="bordered"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} className="bg-white">
                  취소
                </Button>
                <Button color="primary" onPress={onSubmitCodeConfirm}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SchoolForm;
