import { useEditingStore, useProfileOnchangeStore } from '@/store/userStore';
import ProfileSettingLayout from './ProfileSettingLayout';
import { FaCheckSquare } from 'react-icons/fa';
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
import { emailCodeAPI, emailConfirmAPI, schoolConfirmAPI } from '@/utils/api/emailConfirmAPI';
import { useState } from 'react';
import { schoolValidation } from '@/utils/Validation';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useSchoolUpdateMutation } from '@/query/useMutation/useSchoolMutation';

const UserSchoolForm = () => {
  const { data: user } = useGetUserDataQuery();
  const { schoolEmailInputValue, schoolNameInputValue, setSchoolEmailInputValue, setSchoolNameInputValue } =
    useProfileOnchangeStore();
  const { isEditing } = useEditingStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [validationMessages, setValidationMessages] = useState({
    schoolEmail: '',
    univName: ''
  });
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const editable = !user?.school_name && true;

  const { mutate: updateSchoolMutate } = useSchoolUpdateMutation();

  const schoolNamehandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolNameInputValue(e.target.value);
  };

  const schoolEmailhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolEmailInputValue(e.target.value);
  };

  /** 유효성 검사를 넣은 change, 디자인 문제로 추후 추가 예정 */
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'schoolEmail' || name === 'schoolName') {
      const validationResult = schoolValidation(name, value);
      if (typeof validationResult === 'string') {
        // 유효성 검사를 통과하지 못했을 경우, 오류 메시지를 설정합니다.
        setValidationMessages((prev) => ({ ...prev, [name]: validationResult }));
      } else {
        // 유효성 검사를 통과한 경우, 해당 필드의 오류 메시지를 비웁니다.
        setValidationMessages((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  /**인증메일 보내는 로직 */
  const onSubmitEmailConfirm = async () => {
    if (!schoolEmailInputValue || !schoolNameInputValue) {
      customErrToast('이메일과 학교명을 모두 입력해주세요.');
      return;
    }

    // 학교명 유효성 검사
    try {
      const schoolValidationResult = await schoolConfirmAPI(schoolEmailInputValue);
      if (!schoolValidationResult.success) {
        customErrToast('학교명을 다시 확인해주세요.');
        return;
      }

      // 학교메일도 유효한 경우, 인증 메일 발송
      const emailConfirmResult = await emailConfirmAPI(schoolEmailInputValue, schoolNameInputValue, true);
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
    if (!schoolEmailInputValue.includes('대학교')) {
      customErrToast('학교명은 "대학교" 글자로 끝나도록 입력해주세요.');
    }
    try {
      const response = await emailCodeAPI(schoolEmailInputValue, schoolNameInputValue, Number(code));
      if (response.success) {
        customSuccessToast('인증 완료');
        onOpenChange();
        updateSchoolMutate({ userId: user!.user_id, schoolEmailInputValue, schoolNameInputValue });
      } else {
        customErrToast('인증 코드가 유효하지 않습니다.');
      }
    } catch (error) {
      customErrToast('인증 과정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '학교명',
          required: '*',
          children: (
            <input
              disabled={isEditing && editable ? false : true}
              className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
              name="school_name"
              value={schoolNameInputValue}
              onChange={schoolNamehandleChange}
            />
          )
        }}
      />
      <ProfileSettingLayout
        info={{
          title: '학교 이메일',
          required: '*',
          children: (
            <>
              <div className="flex w-full items-center gap-2">
                <input
                  disabled={isEditing && editable ? false : true}
                  className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
                  name="school_email"
                  value={schoolEmailInputValue}
                  onChange={schoolEmailhandleChange}
                />
                {user?.isValidate && <FaCheckSquare className="text-[#00C77E]" />}
                {!user?.school_email && isEditing ? (
                  <button
                    className="text-sm border px-4 py-2 rounded-lg"
                    onClick={onSubmitEmailConfirm}
                    disabled={isCodeSent}
                  >
                    인증
                  </button>
                ) : null}
              </div>
            </>
          )
        }}
      />
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
    </>
  );
};

export default UserSchoolForm;
