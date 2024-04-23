import { Avatar, AvatarIcon } from '@nextui-org/react';

export function RoomFemaleAvatar() {
  return (
    <div className="flex items-center">
      <Avatar icon={<AvatarIcon />} className="bg-purpleThird text-white w-[86px] h-[86px]" size="lg" />
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
          color: '#E4D4F4'
        }}
        size="lg"
      />
    </div>
  );
}
