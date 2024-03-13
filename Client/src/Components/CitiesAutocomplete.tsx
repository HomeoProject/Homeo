import { useState, useEffect } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { Place, City } from '../types/types'
import axios from 'axios'

type CustomGooglePlacesAutocompleteProps = {
    onSelectPlace: (places: Place[]) => void
}

const CustomGooglePlacesAutocomplete = ({
    onSelectPlace,
}: CustomGooglePlacesAutocompleteProps) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [fetchedOptions, setFetchedOptions] = useState<Place[]>([])
    const [selectedCities, setSelectedCities] = useState<Place[]>([])
    const maximumCitiesLimit = 6

    // Combine fetched options with selected options to ensure selected options are always valid. This also takes care of the duplicates.
    const options = [
        ...new Map(
            [...selectedCities, ...fetchedOptions].map((option) => [
                option.name,
                option,
            ])
        ).values(),
    ]

    useEffect(() => {
        if (inputValue === '' || inputValue.length < 3) {
            setFetchedOptions([])
            return
        }

        try {
            axios
                .get(
                    `https://api.api-ninjas.com/v1/city?name=${inputValue}&country=PL&limit=5`,
                    {
                        headers: {
                            'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
                        },
                    }
                )
                .then((response) => {
                    setFetchedOptions(
                        response.data.map((city: City) => ({
                            name: city.name,
                        }))
                    )
                })
        } catch (error) {
            console.error(error)
        }
    }, [inputValue])

    return (
        <div className="cities-autocomplete">
            <Autocomplete
                multiple
                id="cities-autocomplete"
                options={options}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                value={selectedCities}
                onChange={(_, newValue) => {
                    // Enforce the maximum limit of cities
                    if (newValue.length <= maximumCitiesLimit) {
                        setSelectedCities(newValue)
                        onSelectPlace(newValue)
                    }
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                // Custom matching function to ensure that the selected options are always valid
                isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search for cities (max 6)..."
                        label="Cities I can work in"
                        InputLabelProps={{ shrink: true }}
                    />
                )}
            />
        </div>
    )
}

export default CustomGooglePlacesAutocomplete
