import {useAuth} from "../contexts/AuthContext"

function Home(){

    const isAuthenticated = useAuth();
    
    return <>
        <h1>Gym Session Planner</h1>
        <h2 style={{color: 'brown', fontSize: '30px'}}>Take your workouts to the next level</h2>
    </>
}

export default Home;
