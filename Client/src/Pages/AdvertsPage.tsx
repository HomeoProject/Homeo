import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import UserCard from '../Components/UserCard'
import FiltersDialog from '../Components/FiltersDialog'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuItem from '@mui/material/MenuItem'
import PersonIcon from '@mui/icons-material/Person'
import Badge from '@mui/material/Badge'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Pagination from '@mui/material/Pagination'
import '../style/scss/AdvertsPage.scss'

const AdvertsPage = () => {
    const searchValue = 'search'

    const getCurrentDimension = () => {
        return window.innerWidth
    }

    const [screenSize, setScreenSize] = useState(getCurrentDimension())
    const [openSearch, setOpenSearch] = useState<boolean>(false)
    const [filterClicked, setFilterClicked] = useState<number>(0)
    const [sortValue, setSortValue] = useState<string>('')
    const [perPageValue, setPerPageValue] = useState<string>('12')
    const [onlyActiveUsers, setOnlyActiveUsers] = useState<boolean>(true)

    const filters = [
        'Category',
        'Price',
        'Rating',
        'Experience',
        'Language',
        'Payment methods',
        'Location',
    ]

    const handleClickOpenSearch = (index: number) => {
        setFilterClicked(index)
        setOpenSearch(true)
    }

    const handleCloseSearch = () => {
        setOpenSearch(false)
    }

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortValue(event.target.value)
    }

    const handlePerPageChange = (event: SelectChangeEvent) => {
        setPerPageValue(event.target.value)
    }

    const handleActiveUsersChange = () => {
        setOnlyActiveUsers(!onlyActiveUsers)
    }

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension)

        return () => {
            window.removeEventListener('resize', updateDimension)
        }
    }, [screenSize])

    // comment

    return (
        <div className="AdvertsPage">
            <div className="adverts-page-search">
                <div className="adverts-page-search-slogan">
                    <span className="adverts-page-search-slogan-value">
                        The best people, for the worst problems
                    </span>
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
                <div className="adverts-page-search-filters">
                    {screenSize > 800 ? (
                        <>
                            {filters.map((filter, index) => {
                                return (
                                    <div key={index}
                                        onClick={() =>
                                            handleClickOpenSearch(index)
                                        }
                                        className="adverts-page-search-filters-container"
                                    >
                                        <span className="adverts-page-search-filters-container-label">
                                            {filter}
                                        </span>
                                        <ExpandMoreIcon />
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <div className="adverts-page-search-filters-container">
                            <span className="adverts-page-search-filters-container-label mobile">
                                Filters
                            </span>
                            <ExpandMoreIcon />
                        </div>
                    )}
                </div>
            </div>
            <div className="adverts-page-cards">
                <div className="adverts-page-cards-label">
                    <span className="adverts-page-cards-label-value">
                        Adverts for {searchValue}
                    </span>
                    <div className="adverts-page-cards-label-right">
                        <div>
                            <Tooltip
                                title={
                                    onlyActiveUsers
                                        ? 'active users only'
                                        : 'all users'
                                }
                            >
                                <Badge
                                    color="primary"
                                    variant={
                                        onlyActiveUsers ? 'dot' : 'standard'
                                    }
                                    overlap="circular"
                                >
                                    <PersonIcon
                                        fontSize="large"
                                        onClick={handleActiveUsersChange}
                                    />
                                </Badge>
                            </Tooltip>
                        </div>
                        <div className="adverts-page-cards-label-page">
                            <span>Per page:</span>
                            <Select
                                value={perPageValue}
                                onChange={handlePerPageChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value={'12'}>12</MenuItem>
                                <MenuItem value={'24'}>24</MenuItem>
                                <MenuItem value={'36'}>36</MenuItem>
                            </Select>
                        </div>
                        <div className="adverts-page-cards-label-filters">
                            <span>Sort by:</span>
                            <Select
                                value={sortValue}
                                onChange={handleSortChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value={'ascending'}>
                                    Price ascending
                                </MenuItem>
                                <MenuItem value={'descending'}>
                                    Price descending
                                </MenuItem>
                                <MenuItem value={'newest'}>Newest</MenuItem>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="adverts-page-cards-grid">
                    <UserCard isDialog={false} />
                    <UserCard isDialog={false} />
                    <UserCard isDialog={false} />
                    <UserCard isDialog={false} />
                </div>
                <div className="adverts-page-cards-pagination">
                    <Pagination count={10} color="primary" />
                </div>
            </div>
            <FiltersDialog
                open={openSearch}
                handleClose={handleCloseSearch}
                openFilter={filterClicked}
            />
        </div>
    )
}

export default AdvertsPage
