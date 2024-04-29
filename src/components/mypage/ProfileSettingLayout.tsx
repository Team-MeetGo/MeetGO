interface ProfileSettingInfo {
  title: string;
  required: string;
  children: React.ReactNode;
}

const ProfileSettingLayout = ({ info }: { info: ProfileSettingInfo }) => {
  return (
    <div className="text-[#4B5563] w-full relative">
      <span className="text-sm font-semibold">{info.title}</span>
      <span className="text-sm font-semibold text-requiredRed">{info.required}</span>
      <div className="flex items-center gap-2 mt-2">{info.children}</div>
    </div>
  );
};

export default ProfileSettingLayout;
