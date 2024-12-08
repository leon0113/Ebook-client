import { Avatar, Button } from "@nextui-org/react";
import { FC } from "react";
import { IoPencil } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthorPublicationTable from "../components/AuthorPublicationTable";
import useAuth from "../hooks/useAuth";

const Profile: FC = () => {
    const { profile } = useAuth();
    const navigate = useNavigate()

    if (!profile) return <Navigate to='/sign-up' />

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-5">
            <div className="flex min-w-96 p-5 flex-col gap-5 md:flex-row">
                <Avatar
                    name={profile.name}
                    src={profile.avatar}
                    className="w-40 h-40 border justify-end"
                    radius="sm"
                />

                <Button onClick={() => navigate('/update-profile')} className="w-10 h-10 ml-auto flex md:hidden" isIconOnly variant="bordered" ><IoPencil /></Button>

                <div className="p-2 text-xl text-slate-900 dark:text-slate-200 flex flex-1 flex-col space-y-4">
                    <p><span className="font-semibold">Name: </span> {profile.name}</p>
                    <p><span className="font-semibold">Email: </span> {profile.email}</p>

                    <p><span className="font-semibold">Role: </span> {
                        profile.role === 'author' ? 'Author' : 'Reader'
                    }</p>

                    {
                        profile.role === 'user' ? (<Link className="text-xs text-slate-900 text-center p-2 bg-yellow-500 rounded-md font-semibold hover:bg-yellow-600 hover:text-white" to='/author-registration'>Become an author</Link>) : (
                            <Link className="text-xs text-center text-slate-900 p-2 bg-yellow-500 rounded-md font-semibold hover:bg-yellow-600 hover:text-white" to='/update-author'>Update Author Info</Link>
                        )
                    }

                </div>
                <Button onClick={() => navigate('/update-profile')} className="w-10 h-10 ml-auto hidden md:flex" isIconOnly variant="bordered" ><IoPencil /></Button>
            </div>

            {
                profile.role === 'author' && <AuthorPublicationTable authorId={profile.authorId} />
            }

        </div>
    )
}

export default Profile;