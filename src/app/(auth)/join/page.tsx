import JoinForm from '@/components/user/JoinForm';
const JoinPage = () => {
  return (
    <div className="w-full m-auto flex flex-col justify-center items-center max-h-[calc(100vh-90px)] -z-10">
      <div className="w-full m-auto flex flex-col justify-center items-center gap-4 h-full">
        <h1 className="text-4xl font-semibold">회원가입</h1>
        <div className="flex flex-col items-center mb-[10px]">
          <p>회원 정보를 입력해주세요.</p>
          <p>비밀번호 찾기시 유효한 이메일이 필요합니다.</p>
        </div>
        <JoinForm />
      </div>
    </div>
  );
};

export default JoinPage;
