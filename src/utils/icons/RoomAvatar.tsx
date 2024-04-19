import { Avatar, AvatarIcon } from '@nextui-org/react';

export function RoomFemaleAvatar() {
  return (
    <div className="flex items-center">
      <Avatar
        icon={<AvatarIcon />}
        classNames={{
          base: 'bg-gradient-to-br from-[#E4D4F4] to-[#E4D4F4]',
          icon: '#FFFFFF'
        }}
        style={{
          backgroundColor: '#E4D4F4',
          color: '#FFFFFF'
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
        classNames={{
          base: 'bg-gradient-to-br from-[#E4D4F4] to-[#E4D4F4]',
          icon: '#E4D4F4'
        }}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#E4D4F4'
        }}
        size="lg"
      />
    </div>
  );
}
