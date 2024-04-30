import { Avatar, AvatarIcon } from '@nextui-org/react';

export function RoomFemaleAvatar() {
  return (
    <div className="flex items-center">
      <Avatar
        icon={<AvatarIcon />}
        // className="w-[86px] h-[86px]"
        style={{ background: '#E4D4F4', color: '#ffffff', width: '86px', height: '86px' }}
        size="lg"
      />
    </div>
  );
}
export function RoomMaleAvatar() {
  return (
    <div className="flex items-center">
      <Avatar
        icon={<AvatarIcon />}
        className="bg-white w-[86px] h-[86px]"
        style={{
          background: '#ffffff',
          color: '#E4D4F4',
          width: '86px',
          height: '86px'
        }}
        size="lg"
      />
    </div>
  );
}
