import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import '../styles/form.css';
import LoadingIndicator from '../components/LoadingIndicator';

function Register(){
    const [usernameInputText, updateUsernameInputText] = useState("");
    const [passwordInputText, updatePasswordInputText] = useState("");
    const [invalidUser, setInvalidUser] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const updateInputText = (event, method) => {
        if(method === "username"){
            updateUsernameInputText(event.target.value);
        }

        if(method === "password"){
            updatePasswordInputText(event.target.value);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setInvalidUser(false);

        if(usernameInputText !== "" && passwordInputText !== "" && usernameInputText.length >= 5 && passwordInputText.length >= 5){
            setLoading(true)
            try {
                const username = usernameInputText;
                const password = passwordInputText;
                // local host route = http://127.0.0.1:8000/user-register/
                // production route = https://gym-workout-manager-production.up.railway.app/user-register/
                const route = "http://127.0.0.1:8000/user-register/";
                const res = await axios.post(route, {username, password});
                navigate("/login");
             } catch (error){
                setInvalidUser(true);
                setErrorMessage("Username already exists");
            } finally {
                setLoading(false)
            }

        } else {
            if(usernameInputText === ""){
                setInvalidUser(true);
                setErrorMessage("Please enter a Username");
            }

            else if(passwordInputText === ""){
                setInvalidUser(true);
                setErrorMessage("Please enter a Password");
            }

            else if(usernameInputText === "" && passwordInputText === ""){
                setInvalidUser(true);
                setErrorMessage("Please enter a Username");
            }

            else if(usernameInputText.length > 0 && usernameInputText.length < 5 && passwordInputText !== ""){
                setInvalidUser(true);
                setErrorMessage("Please make username at least 5 characters.");
            }
            else if (passwordInputText.length > 0 && passwordInputText.length < 5 && usernameInputText !== ""){
                setInvalidUser(true);
                setErrorMessage("Please make password at least 5 characters.");
            }
            else {
                setErrorMessage("Please try again")
            }
        }
    }

    return <>

    <div className="register-container">
    <h1>Sign Up</h1>
    <input placeholder={"Username"} onChange={(e) => updateInputText(e, "username")} className="register-input"></input>
    <br></br>
    <br></br>
    <input placeholder={"Password"} onChange={(e) => updateInputText(e, "password")} className="register-input" type="password"></input>
    { invalidUser && <p style={{marginBottom: '-40px', color: 'red', maxWidth: '220px', wordWrap: 'break-word'}}>{errorMessage}</p>}
        <br></br>
        <br></br>
        {loading && <LoadingIndicator></LoadingIndicator>}
        <button onClick={(event) => handleSubmit(event)} style={{marginTop: '16px', fontSize: '18px',
            backgroundColor: 'tan',
        }} className="register-btn">Register</button>
    </div>
    </>
}

export default Register;
