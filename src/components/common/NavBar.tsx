import { Suspense } from 'react';
import InitUser from '../user/InitUser';
import NavBarContents from './NavBarContents';

const NavBar = async () => {
  return (
    <>
      {/* <InitUser /> */}
      <NavBarContents />
    </>
  );
};

export default NavBar;
