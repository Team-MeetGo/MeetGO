import LoginForm from '@/components/user/LoginForm';

const LoginPage = async () => {
  return (
    <div className="w-full m-auto flex flex-col justify-center items-center min-h-screen absolute top-0">
      <div className="w-full m-auto flex flex-col justify-center items-center">
        <h1 className="text-[40px] font-semibold mb-[40px]">로그인</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
