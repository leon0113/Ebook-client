import { createContext, FC, ReactNode, useEffect } from "react";
import { AuthState, getAuthState, updateProfile, updateStatus } from "../store/slice/auth.slice";
import client from "../api/client";
import { useDispatch, useSelector } from "react-redux";

interface Props {
    children: ReactNode;
}

interface IAuthContext {
    profile: AuthState['profile'];
    status: AuthState['status'];
    signOut(): void
}

export const AuthContext = createContext<IAuthContext>(({
    profile: null,
    status: 'unauthenticated',
    signOut: () => { }
}))

const AuthProvider: FC<Props> = ({ children }) => {

    const { profile, status } = useSelector(getAuthState);
    const dispatch = useDispatch();

    const signOut = async () => {
        dispatch(updateStatus('busy'));
        dispatch(updateStatus('unauthenticated'));
        try {
            await client.post('/auth/logout');
            dispatch(updateStatus('unauthenticated'));
            dispatch(updateProfile(null));
        } catch (error) {
            console.log(error);
            dispatch(updateStatus('unauthenticated'));
        }
    }

    useEffect(() => {
        dispatch(updateStatus('busy'));
        client.get('/auth/profile')
            .then(({ data }) => {
                dispatch(updateProfile(data.profile));
                dispatch(updateStatus('authenticated'));
            })
            .catch(() => {
                dispatch(updateProfile(null));
                dispatch(updateStatus('unauthenticated'));
            })
    }, [])

    return <AuthContext.Provider value={{ profile, status, signOut }}>
        {children}
    </AuthContext.Provider>
}




export default AuthProvider
