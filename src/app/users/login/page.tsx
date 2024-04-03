import LoginForm from '(@/components/user/LoginForm)';

const LoginPage = () => {
  return (
    <div className="max-w-[760px] m-auto min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[40px] font-semibold mb-[40px]">로그인</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
