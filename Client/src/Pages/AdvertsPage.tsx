import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import UserCard from '../Components/UserCard'
import FiltersDialog from '../Components/FiltersDialog'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import '../style/scss/AdvertsPage.scss'

const AdvertsPage = () => {
    const searchValue = 'search'

    const getCurrentDimension = () => {
        return window.innerWidth
    }

    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const [open, setOpen] = useState<boolean>(false)
    const [filterClicked, setFilterClicked] = useState<number>(0)

    const filters = ['Category', 'Price', 'Rating', 'Experience', 'Language', 'Payment methods', 'Location']

    const handleClickOpen = (index: number) => {
        setFilterClicked(index)
        console.log(index)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
  
    useEffect(() => {
        const updateDimension = () => {
        setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);
            
    return(() => {
        window.removeEventListener('resize', updateDimension);
    })
    }, [screenSize])

    // comment

    return (
    <div className="AdvertsPage">
        <div className="adverts-page-search">
            <div className='adverts-page-search-slogan'>
                <span className='adverts-page-search-slogan-value'>The best people, for the worst problems</span>
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
            <div className='adverts-page-search-filters'>
                {(screenSize > 800) ? (
                    <>
                        {filters.map((filter, index) => {
                            return (
                                <div onClick={() => handleClickOpen(index)} className='adverts-page-search-filters-container'>
                                    <span className='adverts-page-search-filters-container-label'>{filter}</span>
                                    <ExpandMoreIcon/>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <div className='adverts-page-search-filters-container'>
                        <span className='adverts-page-search-filters-container-label mobile'>Filters</span>
                        <ExpandMoreIcon/>
                    </div>
                )}
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
        <FiltersDialog open={open} handleClose={handleClose} openFilter={filterClicked}/>
    </div>)
}

export default AdvertsPage
