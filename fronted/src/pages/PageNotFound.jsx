import React from 'react'
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate()

    const handleLogin =()=>{
        navigate('/')
    }
    return (
        <div>
            <h1>Page Not Fount</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default PageNotFound
