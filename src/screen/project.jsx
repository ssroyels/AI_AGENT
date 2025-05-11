import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from '../config/axios';
import { useLocation } from 'react-router-dom';
import { initializeSocket, recieveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/user.context';

const Project = () => {
  const location = useLocation();
  const [project, setProject] = useState(location.state.project);
  const [users, setUsers] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const messageBoxRef = useRef(null);
  const [fileTree,setFileTree] = useState({
    
  })

  const [currentFile,setCurrentFile] = useState(null);
  const [openFile,setOpenFile] = useState([]);

  const handleUserClick = (id) => {
    setSelectedUserId((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };



  const addCollaborators = () => {
    axios.put("/projects/add-user", {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId)
    })
      .then(() => setIsModalOpen(false))
      .catch(console.log);
  };

  const send = () => {
    const msgObj = { sender: user, message };
    sendMessage('project-message', msgObj);
    setMessages(prev => [...prev, msgObj]);
    setMessage('');
  };

  useEffect(() => {
    initializeSocket(project._id);

    recieveMessage('project-message', (data) => {
      // const message = JSON.parse(data.message);
      // if(message.fileTree) {
      //   setFileTree(message.fileTree);
      // }
      console.log(data)
      setMessages(prev => [...prev, data]);
    });

    axios.get(`/projects/get-project/${location.state.project._id}`)
      .then(res => setProject(res.data.project))
      .catch(console.log);

    axios.get('/users/all')
      .then(res => setUsers(res.data.users))
      .catch(console.log);
  }, []);

  function WriteAiMessage(message) {
    return message
  }

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="h-screen w-screen flex">
      <section className="left flex flex-col h-screen min-w-96 bg-slate-300">
        <header className="flex justify-between items-center top-0  p-2 px-4 bg-slate-100">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 px-4">
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow flex flex-col pt-0 pb-10 relative overflow-auto ">
          <div
            ref={messageBoxRef} 
            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
          >
            {messages.map((msg, index) => {
              const isSelf = msg.sender._id === user._id;
              const isAI = msg.sender._id === 'ai';
              return (
                <div
                  key={index}
                  className={`message flex flex-col p-2 bg-slate-50 w-fit rounded-md mt-1 max-w-80 ${
                    isSelf ? 'ml-auto max-w-52' : ''
                  }`}
                >
                  <small className="opacity-65 text-xs">{msg.sender.email}</small>
                 <p className="text-sm">
  {
    typeof msg.message === 'string'
      ? msg.message
      : msg.message?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(msg.message)
  }
</p>

                </div>
              );
            })}
          </div>

          <div className="inputField w-full flex absolute bottom-0 ">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="p-2 px-4 border-none flex-grow outline-none"
              placeholder="Enter Message"
            />
            <button onClick={send} className="px-5 bg-slate-900 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-1/4 h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
            isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
          } top-0`}
        >
          <header className="flex justify-between items-center p-2 px-4 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button onClick={() => setIsSidePanelOpen(false)} className="p-2">
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            {project.users &&
              project.users.map((user) => (
                <div
                  key={user._id}
                  className="user flex cursor-pointer hover:bg-slate-200 gap-2 p-2"
                >
                  <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center px-2 text-white bg-slate-600">
                    <i className="ri-user-fill"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
          </div>
        </div>
      </section>
      <section className='right bg-red-50 flex-grow h-full flex '>
        <div className='explorer h-full max-w-64 bg-slate-200 min-w-52'>
        {message.message?.fileTree && (
  <div className="bg-slate-100 p-2 mt-2 rounded-md text-xs whitespace-pre-wrap">
    {Object.keys(message.message.fileTree).map((filename) => (
      <div key={filename}>
        <strong>{filename}</strong>
        <pre>{message.message.fileTree[filename].content}</pre>
      </div>
    ))}
  </div>
)}

        </div>
      
              <div className='code-editor flex flex-col flex-grow  h-full'>
          <div className='top'>
           {
            openFile.map((file,index) => {
             <button className={`open-file cursor-pointer p-2 px-4 flex items-center gap-2 w-fit bg-slate-300`}
                     onClick={() => setCurrentFile(file)}
             >
              <p className='font-semibold text-lg' > {file}</p>


             </button>
            })
           }
             </div>
          <div className='bottom flex flex-grow'>
            {
              fileTree[currentFile] && (
                <textarea name="" value={fileTree[currentFile].content} 
                id="" 
                onChange={(e) => {
                  setFileTree({...fileTree,[currentFile]:{
                    content:e.target.value
                  }})
                }}
                className='w-full h-full p-4 bg-slate-50 outline-none border-none '
                ></textarea>
              )
            }

          </div>
        </div>

          
      
      </section>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-72 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    selectedUserId.has(user._id) ? 'bg-slate-200' : ''
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.name}</h1>
                </div>
              ))}
            </div>
            <button
              onClick={addCollaborators}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
