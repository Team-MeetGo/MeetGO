import LoginForm from '@/components/user/LoginForm';

const LoginPage = () => {
  return (
    <div className="w-full m-auto flex flex-col justify-center items-center max-h-[calc(100vh-266px)] h-full">
      <div className="w-full m-auto flex flex-col justify-center items-center h-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
