import { serverSupabase } from '(@/utils/supabase/server)';
import InitUser from '../user/InitUser';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Avatar
} from '@nextui-org/react';
import MeetGoLogo from '(@/utils/icons/meetgo-logo.png)';
import Image from 'next/image';
import SignOut from './SignOut';

const NavBar = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const { data: userData } = await supabase.from('users').select('*').eq('user_id', String(user?.id));

  return (
    <>
      <InitUser userData={userData} />
      <Navbar>
        <NavbarBrand>
          <Link href="/" className="max-w-[150px]">
            <Image
              src={MeetGoLogo}
              alt="MeetGo Logo"
              style={{
                width: '100%',
                height: 'auto'
              }}
              priority={true}
            />
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/meetingRoom">
              로비
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="review" aria-current="page" color="secondary">
              리뷰게시판
            </Link>
          </NavbarItem>
          {/* <NavbarItem>
            <Link color="foreground" href="#">
              메뉴더있었으면..
            </Link>
          </NavbarItem> */}
          <SignOut />
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          {/* <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="profile"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">OOO님!</p>
              </DropdownItem>
              <DropdownItem key="mypage">마이페이지</DropdownItem>
              <DropdownItem key="helpdesk">고객센터</DropdownItem>
              <DropdownItem key="logout" color="danger">
                LOGOUT
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavBar;
