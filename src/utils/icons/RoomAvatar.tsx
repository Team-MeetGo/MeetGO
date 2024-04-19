import { Avatar, AvatarIcon } from '@nextui-org/react';

export function RoomFemaleAvatar() {
  return (
    <div className="flex items-center">
      <Avatar
        icon={<AvatarIcon />}
        style={{
          backgroundColor: '#E4D4F4',
          color: '#FFFFFF',
          width: '86px',
          height: '86px'
        }}
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
        style={{
          backgroundColor: '#FFFFFF',
          color: '#E4D4F4',
          width: '86px',
          height: '86px'
        }}
        size="lg"
      />
    </div>
  );
}
