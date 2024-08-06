import { useState } from 'react'
import api from '../api'
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/form.css';
import {useAuth} from "../contexts/AuthContext"
import LoadingIndicator from '../components/LoadingIndicator';

function Login(){
    const navigate = useNavigate();
    const [usernameInputText, updateUsernameInputText] = useState("");
    const [passwordInputText, updatePasswordInputText] = useState("");
    const [validUser, setValidUser] = useState(false);
    const { setIsAuthorized } = useAuth();
    const [loading, setLoading] = useState(false)

    const updateInputText = (event, method) => {
        if(method === "username"){
            updateUsernameInputText(event.target.value);
        }

        if(method === "password"){
            updatePasswordInputText(event.target.value);
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(usernameInputText !== ""){
            try {
                setLoading(true);
                setValidUser(false);
                const username = usernameInputText;
                const password = passwordInputText;
                const route = '/api/token/';
                const res = await api.post(route, { "username": username, "password": password });
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                setIsAuthorized(true)
                navigate("/manage/workouts")
               
            } catch (error) {
                setValidUser(true);
            } finally {
                setLoading(false);
            }
        } else {
            setValidUser(true);
        }
       
    }

    return <>

    <div className="login-container">
    <h1>Sign In</h1>
    <input className="login-input" placeholder="Username" onChange={(event) => updateInputText(event, "username")}></input>
    <br></br>
    <br></br>
    <input className="login-input" type="password" placeholder="Password" onChange={(event) => updateInputText(event, "password")}></input>

    { validUser && <p style={{marginBottom: '-40px', color: 'red'}}>Invalid Username or Password</p>}
    <br></br>
    <br></br>
    {loading && <LoadingIndicator></LoadingIndicator>}
    <button onClick={handleSubmit} style={{marginTop: '16px', fontSize: '18px', backgroundColor: 'tan'}}
    className="login-btn">Login</button>
    </div>
    </>
}

export default Login;