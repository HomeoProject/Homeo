import './Style/scss/App.scss'
import HomePage from './Pages/HomePage'
import Header from './Components/Header'
import Footer from './Components/Footer'
import UserCard from './Components/UserCard'

function App() {
  return (
    <div className="App">
      <Header />
      <HomePage />
      <Footer />
      <div style={{display: 'flex', gap: '50px'}}>
        <UserCard/>
        <UserCard/>
        <UserCard/>
      </div>
    </div>
  )
}

export default App
