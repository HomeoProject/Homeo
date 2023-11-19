import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import UserCard from '../Components/UserCard'
import FiltersDialog from '../Components/FiltersDialog'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import '../style/scss/AdvertsPage.scss'

const AdvertsPage = () => {
    const searchValue = 'search'

    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const [open, setOpen] = useState<boolean>(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

  	function getCurrentDimension() {
    	return window.innerWidth
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
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Category</span>
                            <ExpandMoreIcon/>
                        </div>
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Price</span>
                            <ExpandMoreIcon/>
                        </div>
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Rating</span>
                            <ExpandMoreIcon/>
                        </div>
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Experience</span>
                            <ExpandMoreIcon/>
                        </div>
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Language</span>
                            <ExpandMoreIcon/>
                        </div>
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Payment methods</span>
                            <ExpandMoreIcon/>
                        </div>
                        <div onClick={handleClickOpen} className='adverts-page-search-filters-container'>
                            <span className='adverts-page-search-filters-container-label'>Location</span>
                            <ExpandMoreIcon/>
                        </div>
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
        <FiltersDialog open={open} handleClose={handleClose}/>
    </div>)
}

export default AdvertsPage
