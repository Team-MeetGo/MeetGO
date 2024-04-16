import InitUser from '../user/InitUser';
import InitChatRealTime from './InitChatRealTime';
import NavBarContents from './NavBarContents';

const NavBar = async () => {
  return (
    <>
      {/* <InitUser /> */}
      <NavBarContents />
      <InitChatRealTime />
    </>
  );
};

export default NavBar;
