import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
import { set } from 'react-hook-form'

const AdvertsPage = () => {

  const { getAccessTokenSilently } = useAuth0()
  const { dictionary } = useDictionaryContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const getCurrentDimension = () => {
    return window.innerWidth
  }

  const [screenSize, setScreenSize] = useState(getCurrentDimension())
  const [searchValue, setSearchValue] = useState<string>('')
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [filterClicked, setFilterClicked] = useState<number>(0)
  const [sortValue, setSortValue] = useState<string>('asc')
  const [searchShow, setSearchShow] = useState<string>('...')
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
  const [defaultPageNumber, setDefaultPageNumber] = useState<number | null>(
    null
  )
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
    const link = `/adverts?page=${page}&sort=${event.target.value}&size=${perPageValue}&${constructorFilters.selectedCategories.length > 0 ? 'categoryIds=' + constructorFilters.selectedCategories.join(',') + '&' : ''}minMinRate=${constructorFilters.priceValue[0]}&maxMinRate=${constructorFilters.priceValue[1]}&ratingValue=${constructorFilters.ratingValue}&directionValue=${constructorFilters.directionValue}${constructorFilters.languages.length > 0 ? '&languages=' + constructorFilters.languages.join(',') : ''}&isApproved=${constructorFilters.isApproved}${constructorFilters.selectedPaymentMethods.length > 0 ? '&paymentMethods=' + constructorFilters.selectedPaymentMethods.join(',') : ''}${constructorFilters.selectedPlaces.length > 0 ? '&cities=' + constructorFilters.selectedPlaces.join(',') : ''}`
    setSortValue(event.target.value)
    navigate(link)
  }

  const handlePerPageChange = (event: SelectChangeEvent) => {
    const link = `/adverts?page=${page}&sort=${sortValue}&size=${event.target.value}&${constructorFilters.selectedCategories.length > 0 ? 'categoryIds=' + constructorFilters.selectedCategories.join(',') + '&' : ''}minMinRate=${constructorFilters.priceValue[0]}&maxMinRate=${constructorFilters.priceValue[1]}&ratingValue=${constructorFilters.ratingValue}&directionValue=${constructorFilters.directionValue}${constructorFilters.languages.length > 0 ? '&languages=' + constructorFilters.languages.join(',') : ''}&isApproved=${constructorFilters.isApproved}${constructorFilters.selectedPaymentMethods.length > 0 ? '&paymentMethods=' + constructorFilters.selectedPaymentMethods.join(',') : ''}${constructorFilters.selectedPlaces.length > 0 ? '&cities=' + constructorFilters.selectedPlaces.join(',') : ''}`
    setPerPageValue(event.target.value)
    navigate(link)
  }

  const handleActiveUsersChange = () => {
    setOnlyActiveUsers(!onlyActiveUsers)
  }

  const handlePagination = (_event: unknown, value: number) => {
    const link = `/adverts?page=${value - 1}&sort=${sortValue}&size=${perPageValue}&${constructorFilters.selectedCategories.length > 0 ? 'categoryIds=' + constructorFilters.selectedCategories.join(',') + '&' : ''}minMinRate=${constructorFilters.priceValue[0]}&maxMinRate=${constructorFilters.priceValue[1]}&ratingValue=${constructorFilters.ratingValue}&directionValue=${constructorFilters.directionValue}${constructorFilters.languages.length > 0 ? '&languages=' + constructorFilters.languages.join(',') : ''}&isApproved=${constructorFilters.isApproved}${constructorFilters.selectedPaymentMethods.length > 0 ? '&paymentMethods=' + constructorFilters.selectedPaymentMethods.join(',') : ''}${constructorFilters.selectedPlaces.length > 0 ? '&cities=' + constructorFilters.selectedPlaces.join(',') : ''}`

    setPage(value - 1)
    navigate(link)
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
    const page = searchParams.get('page')
    const categoryIdsURL = searchParams.get('categoryIds')
    const minMinRateURL = searchParams.get('minMinRate')
    const maxMinRateURL = searchParams.get('maxMinRate')
    const ratingValueURL = searchParams.get('ratingValue')
    const directionValueURL = searchParams.get('directionValue')
    const isApprovedURL = searchParams.get('isApproved')
    const languagesURL = searchParams.get('languages')
    const paymentMethodsURL = searchParams.get('paymentMethods')
    const citiesURL = searchParams.get('cities')
    const perPageValue = searchParams.get('size')
    const sortValue = searchParams.get('sort')
    const searchValueURL = searchParams.get('search')

    if (page !== null) {
      setDefaultPageNumber(parseInt(page))
      setPage(parseInt(page))
    } else {
      setDefaultPageNumber(0)
    }

    setConstructorFilters({
      selectedCategories:
        categoryIdsURL !== null
          ? categoryIdsURL.split(',')
          : constructorFilters.selectedCategories,
      priceValue:
        minMinRateURL && maxMinRateURL
          ? [parseInt(minMinRateURL), parseInt(maxMinRateURL)]
          : constructorFilters.priceValue,
      ratingValue: ratingValueURL
        ? parseInt(ratingValueURL)
        : constructorFilters.ratingValue,
      directionValue: directionValueURL ? directionValueURL : 'or less',
      isApproved: isApprovedURL
        ? isApprovedURL === 'true'
        : constructorFilters.isApproved,
      languages:
        languagesURL !== null
          ? languagesURL.split(',')
          : constructorFilters.languages,
      selectedPaymentMethods:
        paymentMethodsURL !== null
          ? paymentMethodsURL.split(',')
          : constructorFilters.selectedPaymentMethods,
      selectedPlaces:
        citiesURL !== null
          ? citiesURL.split(',')
          : constructorFilters.selectedPlaces,    
    })

    if (searchValueURL !== null) {
      setSearchValue(searchValueURL)
      setSearchShow(searchValueURL)
    }

    if (perPageValue !== null) {
      setPerPageValue(perPageValue)
    }

    if (sortValue !== null) {
      setSortValue(sortValue)
    }
    // eslint-disable-next-line
  }, [])

  const searchForConstructors = async () => {
    if(searchShow !== searchValue && searchValue !== '') {
      setSearchShow(searchValue)
    }
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
      generalSearchQuery: searchValue !== '' ? searchValue : null,    
    }
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

  useEffect(() => {
    if (defaultPageNumber !== null) {
      searchForConstructors()
    }
  }, [
    constructorFilters,
    getAccessTokenSilently,
    page,
    defaultPageNumber,
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
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="adverts-page-search-wrapper-button" onClick={() => searchForConstructors()}>
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
            <div
              className="adverts-page-search-filters-container"
              onClick={() => handleClickOpenSearch(0)}
            >
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
            {dictionary.advertsFor}&nbsp;{searchShow}
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
                  customConstructor={{
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
          {defaultPageNumber !== null && (
            <Pagination
              count={totalPages}
              defaultPage={defaultPageNumber + 1}
              color="primary"
              onChange={handlePagination}
            />
          )}
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
