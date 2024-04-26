import LoginForm from '@/components/user/LoginForm';

const LoginPage = () => {
  return (
    <div className="w-full m-auto flex flex-col justify-center items-center min-h-screen absolute top-0">
      <div className="w-full m-auto flex flex-col justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
