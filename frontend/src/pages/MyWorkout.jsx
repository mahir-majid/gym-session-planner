import { useState, useEffect, useRef } from 'react'
import api from '../api'
import '../styles/authenticated.css'

function MyWorkout(){

    const [workoutSections, setWorkoutSections] = useState([]);
    const divRef = useRef(null);
    const [chosenWorkoutTitleMargin, setChosenWorkoutTitleMargin] = useState(38);
    const [chosenWorkoutTitle, setChosenWorkoutTitle] = useState("");
    const [globalWorkoutIndex, setGlobalWorkoutIndex] = useState(-1);
    const [exerciseList, setExerciseList] = useState([]);
    const [exerciseColors, setExerciseColors] = useState([]);

    const getSections = async() => {
        try {
            const sectionArray = [];
            const listOfIds = [];
            const res = await api.get('/workout-sections/');

            for(let i = 0; i < res.data.length; i++){
                sectionArray.push(res.data[i].title);
                listOfIds.push(res.data[i].id);
            }

            setWorkoutSections(sectionArray); 

            for(let j = 0; j < res.data.length; j++){

                if(res.data[j].chosen === true){
                    setChosenWorkoutTitle(res.data[j].title);
                    getExercises(j);
                    setGlobalWorkoutIndex(j);
                }
            }
               
        } catch(error){
            
        }

    }

    const getExercises = async(index) => {
        const exercisesArray = [];
        const theExerciseColors = [];
        const res = await api.get('/workout-sections/');

        for(let i = 0; i < res.data[index].exercises.length; i++){
            exercisesArray.push(res.data[index].exercises[i].content);  
            theExerciseColors.push('gray');  
            
            if(res.data[index].exercises[i].completed === true){
                theExerciseColors[i] = 'green';
            }
        }

        setExerciseList(exercisesArray);
        setExerciseColors(theExerciseColors);

    }
   
    const selectChosenWorkout = async(index) => {
        setChosenWorkoutTitle(workoutSections[index]);
        setGlobalWorkoutIndex(index);
        getExercises(index);

        const res = await api.get('/workout-sections/');

        for(let i = 0; i < res.data.length; i++){
            let workoutSectionID = res.data[i].id;

            if(i === index){
                const wRes = await api.patch(`workout-section-chosen/${workoutSectionID}/`);
            } else {
                const lRes = await api.patch(`workout-section-default/${workoutSectionID}/`)
            }
        }

        // Configuring Congratulations View as needed
        congratulationCheck(0);
    }

    const completeExercise = async(exerciseIndex) => {
        const theExerciseColors = [...exerciseColors];
        theExerciseColors[exerciseIndex] = 'green';
        setExerciseColors(theExerciseColors);        

        // Sent api request to update exercise completed status to false
        const res = await api.get('/workout-sections/');
        const exerciseID = res.data[globalWorkoutIndex].exercises[exerciseIndex].id;

        const wRes = await api.patch(`exercises/complete/${exerciseID}/`);

        congratulationCheck(0);

    }

    const exerciseReset = async() => {
        const theExerciseColors = [...exerciseColors];

        for(let i = 0; i < theExerciseColors.length; i++){
            theExerciseColors[i] = 'gray';
        }

        setExerciseColors(theExerciseColors);

        // backend api for reseting all exercises complete values to false
        const res = await api.get('/workout-sections/');

        for(let i = 0; i < res.data.length; i++){
            for(let j = 0; j < res.data[i].exercises.length; j++){
                const exerciseID = res.data[i].exercises[j].id;
                const lRes = await api.patch(`exercises/default/${exerciseID}/`);
            }
        }
    }

    useEffect(() => {
        getSections();

    }, [])

    useEffect(() => {
        if(divRef.current){
            // Calculates how many rows the workout sections take up
            let numWorkoutSectionRows = Math.ceil((divRef.current.offsetHeight - 197) / 115) + 1;
            setChosenWorkoutTitleMargin(chosenWorkoutTitleMargin + (numWorkoutSectionRows - 1) * 18);
        }
    }, [divRef.current])

    return <>
        <div style={{ marginTop: '-50px', textAlign: 'center' }}>
            <div>
                <div style = {{position: 'absolute', top: '12.25%', left: '0%', right:'0%', zIndex: '50', 
                    }} ref = {divRef}>
                    <h1 style = {{fontSize:" 50px"}}>Select a Workout</h1>
                    <div className = "button-container">
                        {workoutSections.map((title, index) => (
                            <div key={index}>
                                <button style={{fontSize: '25px'}} onClick={() => selectChosenWorkout(index)}>{title}</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style = {{marginTop:'0px', width: '100%',position: 'absolute', top: `${chosenWorkoutTitleMargin}%`, left: '0%', 
                    right:'0%', backgroundColor: "#e7e7e7", }}>
                    <h1 style={{ color: 'brown' }}>{chosenWorkoutTitle}</h1>
                    {exerciseList.map((title, index) => (
                        <div key={index} style = {{}} className="my-exercises-container">
                            <p className="my-exercises-txt" style={{ backgroundColor: exerciseColors[index], color: 'white' }}>{index + 1}. {title}</p>
                            <button className="my-exercises-btn" onClick={() => { completeExercise(index)}}>Complete</button>
                        </div>
                    ))}
                    { exerciseList.length > 0 && <button style={{marginBottom: '25px'}} onClick={exerciseReset}>Reset</button>}
                </div>
            </div>
        </div>
    </>
    
}

export default MyWorkout;
