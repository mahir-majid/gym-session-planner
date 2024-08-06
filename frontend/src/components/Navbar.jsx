import { useNavigate} from "react-router-dom"
import {useEffect} from "react"
import api from '../api'
import '../styles/form.css';
import ReactLogo from '../assets/react.svg'; // Import the image
import Heart from '../assets/Heart.png';
import {useAuth} from "../contexts/AuthContext"


function Navbar(){
    const navigate = useNavigate();
    const { isAuthorized, setIsAuthorized } = useAuth();


    useEffect(() => {
        console.log("NAVVX", isAuthorized)
    }, [isAuthorized])

    const goTo = (path) => {
        navigate(path);
    }

    // BAKA
    const logOut = async () => {
        const res = await api.get('/workout-sections/');

        // backend api for reseting the chosen workout section to false
        for(let i = 0; i < res.data.length; i++){
            let workoutSectionID = res.data[i].id;
            console.log('Data you are looking for!@(!)@!', res.data[i].id);
            const lRes = await api.patch(`workout-section-default/${workoutSectionID}/`);
        }

        // backend api for reseting all exercises complete values to false
        const eRes = await api.get('/workout-sections/');

        for(let i = 0; i < eRes.data.length; i++){
            for(let j = 0; j < eRes.data[i].exercises.length; j++){
                const exerciseID = eRes.data[i].exercises[j].id;
                console.log(exerciseID);
                const lRes = await api.patch(`exercises/default/${exerciseID}/`);
            }
        }

        localStorage.clear();
        setIsAuthorized(false);
        navigate("/");
    }

    return <>
        <div className="navbar" style={{height: '70px', maxHeight:"70px"}}>
            <div className="buttons left-buttons">
                <div className="nav-button" style={{backgroundColor: 'transparent'}}>
                    <img src={Heart} width="69px" height="80px" alt="React Logo" className="nav-button-image"
                    style={{position: 'relative'}} />
                </div>
                <button className="nav-button" onClick = {() => goTo("/")}>Home</button>
                <button className="nav-button" onClick = {() => goTo("/manage/workouts")}>Manage Workouts</button>
                <button className="nav-button" onClick={() => goTo('/workout')}>Workout</button>
                <button className="nav-button" onClick={() => goTo('/about')}>About</button>

            </div>
            <div className="buttons right-buttons">
            {!isAuthorized ? (
                <>
                    <button className="nav-button" onClick={() => goTo('/login')}>Login</button>
                    <button className="nav-button" onClick={() => goTo('/register')}>Register</button>
                </>
            ) : (
                <>
                    <button style = {{marginRight: "20px"}} className="nav-button" onClick={() => logOut()}>Log out</button>
                </>
            )}
            </div>
        </div>
    </>
}

export default Navbar;