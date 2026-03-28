import { cn } from "@/lib/utils";

interface ProfileFieldProps {
  label: string;
  value: string;
  className?: string;
}

const ProfileField = ({ label, value, className }: ProfileFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3", className)}>
      <p className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
        {label}
      </p>
      <div className="border border-[#DFE3E8] rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 w-full">
        <p className="font-poppins text-sm sm:text-base leading-6 text-[#212B36]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ProfileField;
