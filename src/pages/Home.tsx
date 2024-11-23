import useAuth from "../hooks/useAuth"

export default function Home() {
    const { status } = useAuth();

    console.log(status);
    return (
        <div>Home</div>
    )
}
