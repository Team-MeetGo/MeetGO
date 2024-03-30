const JOIN_FORM = [
  {
    type: 'text',
    id: 'userId',
    placeholder: 'ID',
    error: 'E-Mail 형식으로 작성해 주세요.'
  },
  {
    type: 'password',
    id: 'password',
    placeholder: 'PassWord',
    error: '숫자, 문자, 특수문자 조합으로 8자이상 작성해 주세요.'
  },
  {
    type: 'text',
    id: 'nickname',
    placeholder: 'Nickname',
    error: '2 ~ 15자로 작성해 주세요.'
  }
];

const JoinPage = () => {
  return (
    <div>
      <h1>회원가입</h1>
      <form>
        {JOIN_FORM.map(({ type, id, placeholder, error }) => (
          <label key={id}>
            <input type={type} id={id} placeholder={placeholder} />
          </label>
        ))}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default JoinPage;
