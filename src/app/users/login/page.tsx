const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>
          <input type="email" id="userId" placeholder="ID" />
        </label>
        <label>
          <input type="password" id="password" placeholder="Password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
