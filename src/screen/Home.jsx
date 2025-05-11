import React, { useContext, useEffect, useState } from 'react'
//import {UserContext} from "../context/user.context"
import axiosInstance from '../config/axios';
import {useNavigate} from "react-router-dom"




const Home = () => {
  //const { user } = useContext(UserContext);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [projectName,setProjectName] = useState(null)
  const [project,setProject] = useState([]);

  const navigate = useNavigate();



  function createProject(e) {
    e.preventDefault();
    console.log({projectName})
    axiosInstance.post("/projects/create",{
      name:projectName,
    }).then((res) => {
      console.log(res);
  
      setIsModalOpen(false)

    }).catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    axiosInstance.get("/projects/all").then((res) => {
      console.log(res.data)
      setProject(res.data.projects)
    }).catch(err => {
      console.log(err);
    }) 
  },[])
  return (
  <main className='p-4 bg-slate-100' >
    <div className='projects'>
     
     
      <button 
        onClick={() => setIsModalOpen(true)}
      className='project p-4 border border-slate-300 rounded-md'>
        New Project
        <i className='ri-link ml-2'></i>
      </button>
   
      {
        project.map((project) => 
          ( <div key={project._id} 
            onClick={() => {navigate(`/project`,{
              state: { project }
          })}}
            className='project flex flex-col-reverse mt-[3vh] gap-2 cursor-pointer p-4 border border-slate-300 rounded-md w-[20vh] hover:bg-slate-400'>
           <h2 className='font-semibold'>{project.name}</h2>
          
          <div className='flex gap-2'>
           <p><small> <i className='ri-user-line'></i> Collaborators</small>:</p>
            {project.users.length}
          </div>
          </div>
        )
        )
      }
      
    </div>
    {isModalOpen && (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>

        <div className='bg-white  p-6 rounded-md shadow-md md:w-1/3 '>
        <h2 className='text-xl mb-4'>Create New Projects</h2>
        <form className='' onSubmit={createProject}>
          <div className='mb-4 '>
            <label htmlFor="" className='block text-sm font-medium text-gray-700'>Project Name</label>
            <input
              onChange={(e) => setProjectName(e.target.value)} 
             type="text" className='mt-1 block w-full p-2 border border-gray-300 rounded-md' required />

          </div>
          <div className='flex   md:justify-end'>
            <button type='button' className='mr-2  ml-[10vh] md:ml-0 px-4 py-2 bg-gray-300 rounded-md' onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type='submit' className='px-4  py-2 bg-blue-600 text-white rounded-md'>Create</button>
          </div>
        </form>

        </div>

      </div>
    )}

  </main>
  )
}

export default Home
