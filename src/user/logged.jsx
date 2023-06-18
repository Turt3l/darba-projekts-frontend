import { useEffect } from "react"
import getUser from "../store/getUser"
import DispatchPanel from "./dispatch"
import Alert from "./responder"
import USER_ONLINE from "../store/userOnline"
import { useMutation } from "@apollo/client"
import "./style.scss"
import { redirect } from "react-router-dom"
export default function LogPage() {
    const token = localStorage.getItem("token")
    const base64URL = token.split(".")[1]
    const base64 = base64URL.replace("-", "+").replace("_", "/")
    const tokenPayload = JSON.parse(window.atob(base64))
    const { userData, userError, userLoading } = getUser(tokenPayload.userPin)
    const [userOffline, {data, error, loading}] = useMutation(USER_ONLINE)
    if (userLoading) return <div>Loading...</div>;
    if (userError) return <div>Error...</div>;
    const handleBeforeUnload = () => {
        userOffline({variables: {pin: userData.pin}})
        redirect("/")
    };
    return(
        <div className="loggedPageContainer">
            <div className="logOutButton">
                <button onClick={handleBeforeUnload}>
                    Log out
                </button>
            </div>
            <div className="greetingContainer">
                <div className="greeting">
                    Welcome, {userData.username}
                </div>
            </div>
            <div className="activeAlertContainer">
                {userData.role === "Dispatch" ? <DispatchPanel/> : <Alert userData={userData}/>}
            </div>
        </div>
    )
}