import { createContext, FC, ReactNode, useEffect } from "react";
import { AuthState, getAuthState, updateProfile, updateStatus } from "../store/slice/auth.slice";
import client from "../api/client";
import { useDispatch, useSelector } from "react-redux";
import { parseError } from "../utils/helper";

interface Props {
    children: ReactNode;
}

interface IAuthContext {
    profile: AuthState['profile'];
    status: AuthState['status'];
    signOut(): void
}

// eslint-disable-next-line react-refresh/only-export-components
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
        try {
            await client.post('/auth/logout');
            dispatch(updateStatus('unauthenticated'));
            dispatch(updateProfile(null));
        } catch (error) {
            parseError(error);
            dispatch(updateStatus('unauthenticated'));
        }
    }

    useEffect(() => {
        client.get('/auth/profile')
            .then(({ data }) => {
                dispatch(updateProfile(data.profile));
                dispatch(updateStatus('authenticated'));
            })
            .catch(() => {
                dispatch(updateProfile(null));
                dispatch(updateStatus('unauthenticated'));
            })
    }, [dispatch])

    return <AuthContext.Provider value={{ profile, status, signOut }}>
        {children}
    </AuthContext.Provider>
}




export default AuthProvider
