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
import LoadingSpinner from '../Components/LoadingSpinner.tsx'
import '../style/scss/AdvertsPage.scss'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useAuth0 } from '@auth0/auth0-react'
import apiClient from '../AxiosClients/apiClient'
import { ConstructorFilters, ConstructorByFilters } from '../types/types.ts'

const AdvertsPage = () => {
  const searchValue = 'search'

  const { getAccessTokenSilently } = useAuth0()
  const { dictionary } = useDictionaryContext()

  const getCurrentDimension = () => {
    return window.innerWidth
  }

  const [screenSize, setScreenSize] = useState(getCurrentDimension())
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [filterClicked, setFilterClicked] = useState<number>(0)
  const [sortValue, setSortValue] = useState<string>('asc')
  const [onlyActiveUsers, setOnlyActiveUsers] = useState<boolean>(false)
  const [constructorFilters, setConstructorFilters] =
    useState<ConstructorFilters>({
      selectedCategories: [],
      priceValue: [0, 500],
      ratingValue: 5,
      directionValue: 'or less',
      isApproved: false,
      languages: [],
      selectedPaymentMethods: [],
      selectedPlaces: [],
    })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [perPageValue, setPerPageValue] = useState<string>('12')
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [constructors, setConstructors] = useState<ConstructorByFilters[]>([])

  const filters = [
    dictionary.categories,
    dictionary.priceWord,
    dictionary.ratingWord,
    dictionary.isApproved,
    dictionary.languages,
    dictionary.paymentMethodsWord,
    dictionary.locationWord,
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

  useEffect(() => {
    const searchForConstructors = async () => {
      const body = {
        categoryIds:
          constructorFilters.selectedCategories.length !== 0
            ? [
                ...constructorFilters.selectedCategories.map(
                  (category) => category
                ),
              ]
            : null,
        minMinRate: constructorFilters.priceValue[0],
        maxMinRate: constructorFilters.priceValue[1],
        minAverageRating:
          constructorFilters.directionValue === 'or less'
            ? 0
            : constructorFilters.ratingValue,
        maxAverageRating:
          constructorFilters.directionValue === 'or more'
            ? 5
            : constructorFilters.ratingValue,
        exactAverageRating:
          constructorFilters.directionValue === 'exactly that'
            ? constructorFilters.ratingValue
            : null,
        isApproved: constructorFilters.isApproved,
        languages:
          constructorFilters.languages.length !== 0
            ? constructorFilters.languages
            : null,
        paymentMethods:
          constructorFilters.selectedPaymentMethods.length !== 0
            ? constructorFilters.selectedPaymentMethods.map((payment: string) =>
                payment.toUpperCase()
              )
            : null,
        cities:
          constructorFilters.selectedPlaces.length !== 0
            ? constructorFilters.selectedPlaces
            : null,
      }
      console.log(body)
      setIsLoading(true)
      try {
        const response = await apiClient.post(
          `/search?page=${page}&size=${perPageValue}&sort=minRate,${sortValue}`,
          body
        )
        console.log(response)
        setTotalPages(response.data.totalPages)
        setConstructors(response.data.content)
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }

    searchForConstructors()
  }, [
    constructorFilters,
    getAccessTokenSilently,
    page,
    perPageValue,
    sortValue,
  ])

  return (
    <div className="AdvertsPage">
      <div className="adverts-page-search">
        <div className="adverts-page-search-slogan">
          <span className="adverts-page-search-slogan-value">
            {screenSize > 1250
              ? dictionary.advertsTitle
              : dictionary.secondAdvertsTitle}
          </span>
        </div>
        <div className="adverts-page-search-wrapper">
          <input
            className="adverts-page-search-wrapper-input"
            type="text"
            placeholder={
              screenSize > 900
                ? dictionary.homePageSearchPlaceholder
                : `${dictionary.searchWord}...`
            }
          />
          <button className="adverts-page-search-wrapper-button">
            <SearchIcon />
          </button>
        </div>
        <div className="adverts-page-search-filters">
          {screenSize > 1250 ? (
            <>
              {filters.map((filter, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleClickOpenSearch(index)}
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
                {dictionary.filtersWord}
              </span>
              <ExpandMoreIcon />
            </div>
          )}
        </div>
      </div>
      <div className="adverts-page-cards">
        <div className="adverts-page-cards-label">
          <span className="adverts-page-cards-label-value">
            {dictionary.advertsFor}&nbsp;{searchValue}
          </span>
          <div className="adverts-page-cards-label-right">
            <div>
              <Tooltip
                title={
                  onlyActiveUsers
                    ? dictionary.activeUsersOnly
                    : dictionary.allUsersWord
                }
              >
                <Badge
                  color="primary"
                  variant={onlyActiveUsers ? 'dot' : 'standard'}
                  overlap="circular"
                >
                  <PersonIcon
                    fontSize="large"
                    onClick={handleActiveUsersChange}
                  />
                </Badge>
              </Tooltip>
            </div>
            {screenSize > 900 && (
              <div className="adverts-page-cards-label-page">
                <span>{dictionary.perPageWord}:</span>
                <Select
                  value={perPageValue}
                  onChange={handlePerPageChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value={'12'}>12</MenuItem>
                  <MenuItem value={'24'}>24</MenuItem>
                  <MenuItem value={'36'}>36</MenuItem>
                </Select>
              </div>
            )}
            <div className="adverts-page-cards-label-filters">
              <span>{dictionary.sortByWord}:</span>
              <Select
                value={sortValue}
                onChange={handleSortChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'asc'}>{dictionary.priceAscending}</MenuItem>
                <MenuItem value={'desc'}>{dictionary.priceDescending}</MenuItem>
              </Select>
            </div>
          </div>
        </div>
        <div className="adverts-page-cards-grid">
          {!isLoading ? (
            constructors.length > 0 ? (
              constructors.map((constructor, index) => (
                <UserCard
                  key={index}
                  isDialog={false}
                  constructorr={{
                    userId: constructor.userId,
                    avatar: constructor.avatar,
                    firstName: constructor.firstName,
                    categoryIds: constructor.categoryIds,
                    phoneNumber: constructor.phoneNumber,
                    cities: constructor.cities,
                    email: constructor.email,
                    minRate: constructor.minRate,
                    averageRating: constructor.averageRating,
                    paymentMethods: constructor.paymentMethods,
                  }}
                />
              ))
            ) : (
              <div className="adverts-page-cards-grid-exaption">
                <span>{dictionary.noConstructorsFound}</span>
              </div>
            )
          ) : (
            <div className="adverts-page-cards-grid-spinner">
              <LoadingSpinner />
            </div>
          )}
        </div>
        <div className="adverts-page-cards-pagination">
          <Pagination
            count={totalPages}
            color="primary"
            onChange={(_, page) => setPage(page - 1)}
          />
        </div>
      </div>
      <FiltersDialog
        open={openSearch}
        handleClose={handleCloseSearch}
        handleSearch={setConstructorFilters}
        openFilter={filterClicked}
      />
    </div>
  )
}

export default AdvertsPage
