import useRouteElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalSotrageEventTarget } from './utils/auth'
import { AppContext } from './context/app.context'
function App() {
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalSotrageEventTarget.addEventListener('clearLS', () => reset)
    return () => {
      LocalSotrageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  const routeElements = useRouteElements()
  return <>{routeElements}</>
}

export default App
