import api from '../api'
import { useState, useEffect } from "react";
import '../styles/authenticated.css'

const Workout = () => {
    const [workoutSections, setWorkoutSection] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [exerciseInputList, setExerciseInputList] = useState([]);
    const [allSectionsId, setSectionsId] = useState([]);
    const [newWorkout, setNewWorkout] = useState("");
    const [newWorkoutVis, setNewWorkoutVis] = useState(false);
    const [sectionInputVis, setSectionInputVis] = useState(false);
    const [exerciseVisList, setExerciseVisList] = useState([]);

    const addNewSection = async(title) => {
        try {
            if(title.length > 0){
            setNewWorkoutVis(false);
            const res = await api.post('/workout-sections/', {title});
            setSectionInputVis(false);
            getSections();
            const clonedExerciseVisArray = [...exerciseVisList];
            const clonedExerciseList = [...exerciseList];

            clonedExerciseVisArray.push(true);
            clonedExerciseList.push([])
            setExerciseList(clonedExerciseList)
            setExerciseVisList(clonedExerciseVisArray);
            setNewWorkout("");
            } else {
                setNewWorkoutVis(true);
            }
        } catch(error) {
            console.log('Could Not Create a New Workout Section', error);
        }
    }

    const addNewExercise = async(contentText, index) => {

            if(contentText.length > 0){
                let workoutSectionID = allSectionsId[index]; 

                const theContent = {
                    workout_section: workoutSectionID,
                    content: contentText,
                    completed: false
                }

                try {
                const res = await api.post(`/exercises/${workoutSectionID}/`, theContent);
                } catch(error){
                    console.log('Error adding new exercise', error.response ? error.response.data : error.message);
                }

                const exerciseArray = [...exerciseList];
                const dupExerciseInputList = [...exerciseInputList];
                exerciseArray[index].push(contentText);
                dupExerciseInputList[index] = "";
                setExerciseList(exerciseArray);
                setExerciseInputList(dupExerciseInputList);
            } else {
            }

    }

    const deleteSection = async(id) => {
        await api.delete(`workout-section/delete/${id}/`).then((res) => {
            
        }).catch((error) => alert(error))
        getSections();
        getExercisesVis();
        getExercises();

        setNewWorkoutVis(false);
    }

    const deleteExercise = async(workoutIndex, exerciseIndex) => {
        const exerciseArray = [...exerciseList];
        exerciseArray[workoutIndex].splice(exerciseIndex, 1);
        setExerciseList(exerciseArray);

        const route = "exercises/delete/<int:exercise_id>/"
        const res = await api.get('/workout-sections/');
        let exerciseID = res.data[workoutIndex].exercises[exerciseIndex].id;

        await api.delete(`exercises/delete/${exerciseID}/`).then((res) => {
            
        }).catch((error) => console.log(error))
        setNewWorkoutVis(false);
    }

    const getSections = async() => {
        try {
            const sectionArray = [];
            const listOfIds = [];
            const res = await api.get('/workout-sections/');

            for(let i = 0; i < res.data.length; i++){
                sectionArray.push(res.data[i].title);
                listOfIds.push(res.data[i].id);
            }

            setSectionsId(listOfIds);
            setWorkoutSection(sectionArray); 
               
        } catch(error){
        }
    }

    const getExercises = async() => {
        const exercisesArray = [];
        const res = await api.get('/workout-sections/');
        const dupExerciseInputList = [];

        for(let i = 0; i < res.data.length; i++){
            let workoutSectionID = res.data[i].id;
            const exRes = await api.get(`/exercises/${workoutSectionID}/`);
            
            const miniExerciseArray = [];

            for(let j = 0; j < exRes.data.length; j++){
                miniExerciseArray.push(exRes.data[j].content);
                dupExerciseInputList.push("");
            }
            
            //TODO: fetch actual exercise list from API
            exercisesArray.push(miniExerciseArray);
        }

        setExerciseList(exercisesArray);
        setExerciseInputList(dupExerciseInputList);
    }

    const getExercisesVis = async () => {
        const theExerciseVisList = [];

        const res = await api.get('/workout-sections/');
        for(let i = 0; i < res.data.length; i++){
            theExerciseVisList.push(true);
        }
        setExerciseVisList(theExerciseVisList);
    }

    const changeExercisesVis = async (index) => {
        const clonedExerciseVisArray = [];
        
        for(let i = 0; i < exerciseVisList.length; i++){
            clonedExerciseVisArray.push(exerciseVisList[i]);
        }

        
        if (clonedExerciseVisArray[index] === true) {
            clonedExerciseVisArray[index] = false;
          } else {
            clonedExerciseVisArray[index] = true
        }
        setExerciseVisList(clonedExerciseVisArray);
        setNewWorkoutVis(false);
    }

    const updateInput = async(event) => {
        setNewWorkout(event.target.value);
    }

    const updateNewExerciseInput = async(event, index) => {
        const exerciseInputArray = [...exerciseInputList];
        exerciseInputArray[index] = event.target.value;
        setExerciseInputList(exerciseInputArray);
    }

    // useEffect for everytime you reload the page; 
    useEffect(() => {
        startUpFunction();
    }, [])


    const startUpFunction = async() => {
        await getExercises();
        await getSections();
        await getExercisesVis();
    }

    return ( 
        <>

        <div style = {{backgroundColor: "#e7e7e7", minWidth: "100%", minHeight: "100%", margin:"-20px"}}>
            <br></br>
            <h1 style={{marginTop: '85px'}}>Manage Workout Sections</h1>

            
            { !sectionInputVis && <button onClick={() => setSectionInputVis(true)}>Add New Workout Section</button>}
            { sectionInputVis && <button onClick={() => addNewSection(newWorkout)} style={{position: 'relative', left: '135px', marginBottom:'-20px'}}
                >Add It!</button> }
            <br></br>
            <br></br>
            { sectionInputVis && <input onChange={(event) => updateInput(event)} style={{position: 'relative', height: '30px',
                right: '55px', top:'-56.5px', borderRadius: '10px', paddingLeft: '10px', paddingBottom: '4px', paddingTop: '4px',
                fontSize: '20px', marginBottom: '-20px'}}></input>}
            { newWorkoutVis && <p style={{position: 'relative', top: '-40px', color: 'blue',
                fontSize: '19px', marginTop: '6px', marginBottom: '-58px',
            }}>Please Enter a Name </p>}
            <br></br>
            <div className = "workout-container">
                {workoutSections.map((title, index) => (
                    <div key={index} className = "growing-textbox">

                        <button className = "del-button" onClick={() => deleteSection(allSectionsId[index])}>x</button>


                        <h2 style={{marginTop: "-30px", fontSize: '30px', maxWidth:"100%", marginLeft: "22px", marginRight: "22px"}}>{title}</h2>
                        <div style={{marginTop: '-15px'}}> 
                        { exerciseList[index].map((exContent, exIndex) => (
                            <div key={exIndex} className="exercise-container">
                                <p className="exercise-txt">{exContent}</p>
                                <button onClick={() => deleteExercise(index, exIndex)} 
                                    className="mini-x-button" >x</button>
                            </div>
                        ))}
                        </div>
                       { exerciseVisList[index] && <button onClick = {() => changeExercisesVis(index)}
                        style={{position: 'relative', top: '3px'}}>Add exercise</button> }

                      { !exerciseVisList[index] && <input style={{position: "relative", left:'-40px', top: '0px', width: '240px', height: '30px',
                        marginLeft:"30px", marginRight:"-30px", paddingLeft: '10px', paddingBottom: '5px', paddingTop: '3px',
                        borderRadius: '10px', fontSize: '20px',
                            visibility: exerciseVisList[index] ? 'hidden' : 'visible'}}
                            onChange = {(event) => updateNewExerciseInput(event, index)}  ></input>  }

                        {!exerciseVisList[index] && <button style={{position: "relative", left:'10px',visibility: exerciseVisList[index] ? 'hidden' : 'visible'}}
                        onClick = {() => {changeExercisesVis(index); addNewExercise(exerciseInputList[index], index);}}> Add</button>}
                    </div>
                ))}
            </div>
            
        </div>

        </>
    );
}
 
export default Workout;
