import SearchIcon from '@mui/icons-material/Search'
import UserCard from '../Components/UserCard'
import '../style/scss/AdvertsPage.scss'

const AdvertsPage = () => {
    const searchValue = 'search'

    return (
    <div className="AdvertsPage">
        <div className="adverts-page-search">
            <div className='adverts-page-search-slogan'>
                <span className='adverts-page-search-slogan-value'>The best people, for the worse problems</span>
            </div>
            <div className="adverts-page-search-wrapper">
                <input
                    className="adverts-page-search-wrapper-input"
                    type="text"
                    placeholder="Search for a service you need..."
                    />
                    <button className="adverts-page-search-wrapper-button">
                        <SearchIcon />
                    </button>
            </div>
            <div>
                Filters
            </div>
        </div>
        <div className='adverts-page-cards'>
            <div className='adverts-page-cards-label'>
                    <span className='adverts-page-cards-label-value'>Adverts for {searchValue}</span>
            </div>
            <div className='adverts-page-cards-grid'>
                <UserCard isDialog={false}/>
                <UserCard isDialog={false}/>
                <UserCard isDialog={false}/>
                <UserCard isDialog={false}/>
            </div>
        </div>
    </div>)
}

export default AdvertsPage
