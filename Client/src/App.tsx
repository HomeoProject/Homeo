import './Style/scss/App.scss'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router'

function App() {
    return (
        <div className="App">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default App
