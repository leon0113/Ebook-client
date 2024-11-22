import { FC } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Avatar, Button } from "@nextui-org/react";
import { IoPencil } from "react-icons/io5";

const Profile: FC = () => {
    const { profile } = useAuth();
    const navigate = useNavigate()

    if (!profile) return <Navigate to='/sign-up' />

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex gap-3">
                <Avatar
                    name={profile.name}
                    src={profile.avatar}
                    className="w-40 h-40 border"
                    radius="sm"
                />
                <div className="p-2 text-xl text-slate-700">
                    <p><span className="font-semibold">Name: </span> {profile.name}</p>
                    <p><span className="font-semibold">Email: </span> {profile.email}</p>
                    <p><span className="font-semibold">Role: </span> {profile.role}</p>
                </div>
                <Button onClick={() => navigate('/update-profile')} className="w-10 h-10 ml-auto" isIconOnly variant="bordered" ><IoPencil /></Button>
            </div>
        </div>
    )
}

export default Profile;