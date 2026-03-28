import { useStateContext } from "@/hooks/useStateContext";
import { useEffect } from "react";


const Logo = () => {


    const { systemSettingsData, isSystemSettingsPending } = useStateContext();

    useEffect(() => { }, [systemSettingsData, isSystemSettingsPending]);

    return <div>{systemSettingsData?.data?.logo ?? 'Trip'}</div>;
};

export default Logo;
