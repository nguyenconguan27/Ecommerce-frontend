import useRouteElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect, useState } from 'react'
import { LocalSotrageEventTarget } from './utils/auth'
import { AppContext } from './context/app.context'
import { ToastContainer } from 'react-toastify'
import Chatbot from './components/Chatbot'
function App() {
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalSotrageEventTarget.addEventListener('clearLS', () => reset)
    return () => {
      LocalSotrageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  const routeElements = useRouteElements()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }
  return (
    <div>
      {routeElements}
      <ToastContainer />
      {isChatOpen && <Chatbot onClose={toggleChat} />}
      <div
        onClick={toggleChat}
        className='fixed bottom-5 right-5 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 cursor-pointer transition duration-300'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='size-6 text-white'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
          />
        </svg>
      </div>
    </div>
  )
}

export default App
