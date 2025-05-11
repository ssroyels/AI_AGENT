import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/user.context"


const Login = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate();

    function SubmitHandler (e)  {
        e.preventDefault();
        axios.post("http://localhost:5000/users/login",{
            email,password
        }).then((res) => {
          console.log(res.data)
          localStorage.setItem('token',res.data.token)
          setUser(res.data.user)
          setEmail("");
          setPassword("");
          navigate("/")
        }).catch((err) => {
          console.log(err.response.data)
        })
   
       
    
      
    }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">

  <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6">
    <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>

    <form className="space-y-4" onSubmit={SubmitHandler}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" required

          value={email}
          onChange={(e) => {setEmail(e.target.value)}}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" name="password" required
           value={password}
           onChange={(e) => {setPassword(e.target.value)}}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600" />
          <span className="ml-2 text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
      </div>

      <button type="submit"
      
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200">
        Sign In
      </button>
    </form>

    <p className="text-sm text-center text-gray-600">
      Don't have an account?
      <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
    </p>
  </div>

</div>
  )
}

export default Login
