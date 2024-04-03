import JoinForm from '(@/components/user/JoinForm)';

const JoinPage = () => {
  return (
    <div className="max-w-[760px] m-auto min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[40px] font-semibold mb-[40px]">회원가입</h1>
      <JoinForm />
    </div>
  );
};

export default JoinPage;
