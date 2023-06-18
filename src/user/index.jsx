import { useMutation } from "@apollo/client"
import { useState } from "react"
import LOGIN from "../store/login"
import "./login.scss"
import { useNavigate } from "react-router-dom"

export default function LogInForm() {
    const navigate = useNavigate()
    const [pin, setPin] = useState('');
    const [login, { loading, error }] = useMutation(LOGIN);

    const handleSubmit = (e) => {
        e.preventDefault();

        login({ variables: { pin: Number(pin) } })
        .then((response) => {
            const token = response.data.login.token;
            localStorage.setItem("token", token)
            navigate(`/logged`)

        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        
        <div className="logIn">
            <div className="logInContainer">
                <div className="logInHeaderContainer">
                    <h1>
                        Log in
                    </h1>
                </div>
                <div className="logInFormContainer">
                    <form onSubmit={handleSubmit} className="form">
                        <input type="text" onChange={e => setPin(e.target.value)} placeholder="Enter PIN"/>
                        <button type="submit">Log in</button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}
