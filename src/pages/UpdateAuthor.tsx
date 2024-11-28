import { FC, useEffect, useState } from "react";
import AuthorForm, { IAuthorInfo, InitialState } from "../components/common/AuthorForm";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import { parseError } from "../utils/helper";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdateAuthor: FC = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [initialState, setInitialState] = useState<InitialState>();
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (data: IAuthorInfo) => {
        const res = await client.patch('/author', data);
        toast.success(res.data.message);
        navigate('/profile')
    }

    useEffect(() => {
        const fetchAuthorInfo = async () => {
            try {
                const { data } = await client.get(`/author/${profile?.authorId}`);
                setInitialState(data);
            } catch (error) {
                parseError(error)
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorInfo()
    }, [profile?.authorId]);

    if (loading) return <Loading />

    return (
        <div>

            <AuthorForm initialState={initialState} onSubmit={handleSubmit} btnTitle="Update Author Info!" />


        </div>
    )
}

export default UpdateAuthor;