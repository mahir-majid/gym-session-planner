import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Workout from './pages/Workout'
import Navbar from './components/Navbar'
import MyWorkout from './pages/MyWorkout'
import About from './pages/About'
import Unauthorized from './pages/Unauthorized'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
  <>
    <Navbar />
   
       <Routes>
   
        <Route path="/" element = { <Home />} />
        <Route path="/register" element = { <Register />} />
        <Route path="/login" element = { <Login />} />
        <Route path="/about" element = { <About />} />
        <Route path="/unauthorized" element = { <Unauthorized />} />
        <Route path="/manage/workouts" element = { <ProtectedRoute> <Workout /> </ProtectedRoute>} />
        <Route path="/workout" element = { <ProtectedRoute> <MyWorkout /> </ProtectedRoute>} />

      </Routes>
  </>
  )
}

export default App
