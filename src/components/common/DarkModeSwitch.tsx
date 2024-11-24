import { Switch } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const DarkModeSwitch: FC = () => {

    const [darkMode, setDarkMode] = useState(false);

    const updateLocalStorage = (themeMode?: 'dark') => {
        if (themeMode) localStorage.setItem("theme", themeMode)
        else localStorage.removeItem("theme")
    }

    const enableDarkMode = () => {
        document.documentElement.classList.add("dark")
        updateLocalStorage('dark');
        setDarkMode(true)
    };

    const disableDarkMode = () => {
        document.documentElement.classList.remove("dark");
        updateLocalStorage();
    };

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') {
            enableDarkMode()
        }
    }, [])

    return (
        <Switch
            size="sm"
            color="success"
            startContent={<IoSunnyOutline />}
            endContent={<IoMoonOutline />}
            isSelected={darkMode}
            onChange={(e) => {
                const { checked } = e.target;
                if (checked) enableDarkMode();
                else disableDarkMode();
                setDarkMode(checked)
            }}
        />
    )
}

export default DarkModeSwitch;