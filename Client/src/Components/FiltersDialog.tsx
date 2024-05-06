import { useState } from 'react'
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

  const { dictionary } = useDictionaryContext()

  const paymentMethods: Array<PaymentMethod> = [
    PaymentMethod.CASH,
    PaymentMethod.CARD,
    PaymentMethod.TRANSFER,
  ]

  const { categories } = useCategoriesContext()

  const handleSliderChange = (event: Event, newValue) => {
    setPriceValue(newValue)
  }

  const handleInputChangeMin = (event) => {
    setPriceValue([event.target.value, priceValue[1]])
  }

  const handleSelectPlace = (places: string[]) => {
    setSelectedPlaces(places)
  }

  const handleInputChangeMax = (event) => {
    setPriceValue([priceValue[0], event.target.value])
  }

  const handleBlur = () => {
    if (priceValue[0] < 0) {
      setPriceValue([0, 0])
    } else if (priceValue[1] > 100) {
      setPriceValue([100, 100])
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

  const resetValues = () => {
    setPriceValue([0, 100])
    setRatingValue(5.0)
    setLanguages([])
    setDirectionValue('or less')
    setSelectedPlaces([])
    setSelectedCategories([])
    setSelectedPaymentMethods([])
  }

  const handleCloseFromDialog = () => {
    resetValues()
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
                          min: 0,
                          max: 100,
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
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        value={priceValue[1]}
                        size="small"
                        onChange={handleInputChangeMax}
                        onBlur={handleBlur}
                        inputProps={{
                          step: 10,
                          min: 0,
                          max: 100,
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
                    onChange={(event, newValue) => {
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
              <span className="filters-dialog-summary">{dictionary.isApproved}</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filters-dialog-is-approved">
                <div className='filters-dialog-is-approved-checkbox'>
                  <div>{dictionary.isApproved}</div>
                  <Checkbox onChange={(e:React.ChangeEvent<HTMLInputElement>) => setIsApproved(e.target.checked)}/>
                </div>
                <div className='filters-dialog-is-approved-explain'>
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
