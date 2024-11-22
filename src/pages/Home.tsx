import useAuth from "../hooks/useAuth"

export default function Home() {
    const authStatus = useAuth();

    console.log(authStatus);
    return (
        <div>Home</div>
    )
}
