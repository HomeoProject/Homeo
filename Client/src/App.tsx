import './style/scss/App.scss'
import './style/themes/mui-styles.scss'
import './style/themes/toastify-styles.scss'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import AppProvider from './Context/AppProvider'

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Header />
        <ToastContainer />
        <Outlet />
        <Footer />
      </AppProvider>
    </div>
  )
}

export default App
