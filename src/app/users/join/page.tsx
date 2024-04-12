import JoinForm from '(@/components/user/JoinForm)';
const JoinPage = () => {
  return (
    <div className="w-full m-auto flex flex-col justify-center items-center min-h-screen absolute top-0">
      <div className="w-full m-auto flex flex-col justify-center items-center">
        <h1 className="text-[40px] font-semibold mb-[40px]">회원가입</h1>
        <JoinForm />
      </div>
    </div>
  );
};

export default JoinPage;
