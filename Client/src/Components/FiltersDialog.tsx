import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Rating from '@mui/material/Rating'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LanguagesAutocomplete from './LanguagesAutocomplete'
import { PaymentMethod } from '../types/types'
import CitiesAutocomplete from './CitiesAutocomplete'
import { useCategoriesContext } from '../Context/CategoriesContext'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { ConstructorFilters } from '../types/types.ts'
import '../style/scss/components/FiltersDialog.scss'

export interface FiltersDialogProps {
  open: boolean
  handleClose: () => void
  openFilter: number
  handleSearch: (filters: ConstructorFilters) => void
}

const FiltersDialog = (props: FiltersDialogProps) => {
  const { open, handleClose, openFilter, handleSearch } = props
  const [priceValue, setPriceValue] = useState<number[]>([0, 500])
  const [ratingValue, setRatingValue] = useState(5.0)
  const [languages, setLanguages] = useState<string[]>([])
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [directionValue, setDirectionValue] = useState<string>('or less')
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([])
  const [searchParams] = useSearchParams()
  const { dictionary } = useDictionaryContext()

  const paymentMethods: Array<PaymentMethod> = [
    PaymentMethod.CASH,
    PaymentMethod.CARD,
    PaymentMethod.TRANSFER,
  ]

  const { categories } = useCategoriesContext()

  useEffect(() => {
    const categoryIdsURL = searchParams.get('categoryIds')
    const minMinRateURL = searchParams.get('minMinRate')
    const maxMinRateURL = searchParams.get('maxMinRate')
    const ratingValueURL = searchParams.get('ratingValue')
    const directionValueURL = searchParams.get('directionValue')
    const isApprovedURL = searchParams.get('isApproved')
    const languagesURL = searchParams.get('languages')
    const paymentMethodsURL = searchParams.get('paymentMethods')
    const citiesURL = searchParams.get('cities')

    if (categoryIdsURL) {
      setSelectedCategories(categoryIdsURL.split(','))
    }

    if (minMinRateURL && maxMinRateURL) {
      if (parseInt(minMinRateURL) > parseInt(maxMinRateURL)) {
        setPriceValue([0, 500])
        return
      }
      setPriceValue([
        parseInt(minMinRateURL) > 500
          ? 490
          : parseInt(minMinRateURL) < 0
            ? 0
            : parseInt(minMinRateURL),
        parseInt(maxMinRateURL) > 500
          ? 500
          : parseInt(maxMinRateURL) < 0
            ? 10
            : parseInt(maxMinRateURL),
      ])
    }

    if (ratingValueURL) {
      setRatingValue(parseFloat(ratingValueURL))
    }

    if (directionValueURL) {
      setDirectionValue(directionValueURL)
    }

    if (isApprovedURL) {
      console.log(isApprovedURL)
      setIsApproved(isApprovedURL === 'true')
    }

    if (languagesURL) {
      setLanguages(languagesURL.split(','))
    }

    if (paymentMethodsURL) {
      setSelectedPaymentMethods(paymentMethodsURL.split(','))
    }

    if (citiesURL) {
      setSelectedPlaces(citiesURL.split(','))
    }

    // eslint-disable-next-line
  }, [])

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') return
    setPriceValue(newValue)
  }

  const handleInputChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceValue([parseInt(event.target.value), priceValue[1]])
  }

  const handleSelectPlace = (places: string[]) => {
    setSelectedPlaces(places)
  }

  const handleInputChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceValue([priceValue[0], parseInt(event.target.value)])
  }

  const handleBlur = () => {
    if (priceValue[0] < 0) {
      setPriceValue([0, 0])
    } else if (priceValue[1] > 500) {
      setPriceValue([500, 500])
    }
  }

  const handleSearchClick = () => {
    handleSearch({
      priceValue,
      ratingValue,
      languages,
      isApproved,
      directionValue,
      selectedPlaces,
      selectedCategories,
      selectedPaymentMethods,
    })
    handleClose()
  }

  const handleSelectCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCategories.includes(e.target.name)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== e.target.name)
      )
    } else {
      setSelectedCategories([...selectedCategories, e.target.name])
    }
  }

  const handleSelectPayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPaymentMethods.includes(e.target.name)) {
      setSelectedPaymentMethods(
        selectedPaymentMethods.filter((pay) => pay !== e.target.name)
      )
    } else {
      setSelectedPaymentMethods([...selectedPaymentMethods, e.target.name])
    }
  }

  const handleCloseFromDialog = () => {
    handleClose()
  }

  return (
    <Dialog
      onClose={handleCloseFromDialog}
      open={open}
      maxWidth={'xl'}
      className="dialog"
    >
      <div className="filtersDialog">
        <div>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 0 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">Category</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filters-dialog-category">
                {categories.map((category, index) => (
                  <div key={index} className="filters-dialog-category-value">
                    <span>
                      <span>{category.name}</span>
                    </span>
                    <Checkbox
                      color="primary"
                      inputProps={{
                        'aria-label': 'secondary checkbox',
                      }}
                      checked={selectedCategories.includes(`${category.id}`)}
                      name={`${category.id}`}
                      onChange={handleSelectCategory}
                    />
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 1 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">Price</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filters-dialog-details">
                <Box sx={{ width: 600 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <TextField
                        value={priceValue[0]}
                        size="small"
                        onChange={handleInputChangeMin}
                        onBlur={handleBlur}
                        inputProps={{
                          step: 10,
                          min: 1,
                          max: 500,
                          type: 'number',
                          'aria-labelledby': 'input-slider',
                        }}
                        sx={{ width: '70px' }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={priceValue}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={1}
                        max={500}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        value={priceValue[1]}
                        size="small"
                        onChange={handleInputChangeMax}
                        onBlur={handleBlur}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 500,
                          type: 'number',
                          'aria-labelledby': 'input-slider',
                        }}
                        sx={{ width: '70px' }}
                      />
                    </Grid>
                    <Grid item>
                      <span>$ / h</span>
                    </Grid>
                  </Grid>
                  <div className="filters-dialog-details-label">
                    <span>Minimum</span>
                    <span>The Range</span>
                    <span>Maximum</span>
                  </div>
                </Box>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 2 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">Rating</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filters-dialog-details">
                <div className="filters-dialog-details-box">
                  <Rating
                    name="simple-controlled"
                    value={ratingValue}
                    precision={0.5}
                    defaultValue={2.5}
                    onChange={(_, newValue) => {
                      setRatingValue(newValue!)
                    }}
                    sx={{ fontSize: '50px' }}
                  />
                  <div className="filters-dialog-details-box-rating">
                    <span className="filters-dialog-details-box-rating-statement">
                      The rating must be {ratingValue},
                    </span>
                    <FormControl>
                      {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={directionValue}
                        // label="Age"
                        onChange={(e) => setDirectionValue(e.target.value)}
                        variant="standard"
                        sx={{
                          minWidth: '100px',
                          fontSize: 'calc(80% + 0.6vw)',
                        }}
                      >
                        <MenuItem value={'or less'}>or less</MenuItem>
                        <MenuItem value={'exactly that'}>exactly that</MenuItem>
                        <MenuItem value={'or more'}>or more</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 3 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">
                {dictionary.isApproved}
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filters-dialog-is-approved">
                <div className="filters-dialog-is-approved-checkbox">
                  <div>{dictionary.isApproved}</div>
                  <Checkbox
                    checked={isApproved}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setIsApproved(e.target.checked)
                    }
                  />
                </div>
                <div className="filters-dialog-is-approved-explain">
                  {dictionary.isApprovedExplained}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 4 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">Language</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filters-dialog-languages">
                <LanguagesAutocomplete
                  selectedLanguages={languages}
                  onSelectLanguage={setLanguages}
                />
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 5 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">Payment methods</span>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {paymentMethods.map((payment, index) => (
                  <div key={index} className="filters-dialog-payment-value">
                    <span>
                      <span>{payment}</span>
                    </span>
                    <Checkbox
                      color="primary"
                      inputProps={{
                        'aria-label': 'secondary checkbox',
                      }}
                      checked={selectedPaymentMethods.includes(payment)}
                      name={payment}
                      onChange={handleSelectPayment}
                    />
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            defaultExpanded={openFilter === 6 ? true : false}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <span className="filters-dialog-summary">Location</span>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <CitiesAutocomplete
                  selectedPlaces={selectedPlaces}
                  onSelectPlace={handleSelectPlace}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <Card
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            marginTop: '10px',
            width: '100%',
          }}
        >
          <Button variant="contained" onClick={handleSearchClick}>
            Look for constructors
          </Button>
        </Card>
      </div>
    </Dialog>
  )
}

export default FiltersDialog
