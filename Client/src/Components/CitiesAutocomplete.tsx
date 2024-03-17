import { useState, useEffect } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { City } from '../types/types'
import apiNinjasClient from '../AxiosClients/apiNinjasClient'
import { AxiosError, AxiosResponse } from 'axios'

type CustomGooglePlacesAutocompleteProps = {
    selectedPlaces: string[]
    onSelectPlace: (places: string[]) => void
}

const CustomGooglePlacesAutocomplete = ({
    selectedPlaces,
    onSelectPlace,
}: CustomGooglePlacesAutocompleteProps) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [fetchedOptions, setFetchedOptions] = useState<City[]>([])
    const maximumCitiesLimit = 6

    // Combine fetched city names with selected city names to ensure selected city names are always valid and to take care of duplicates
    const options = Array.from(
        new Set([
            ...selectedPlaces,
            ...fetchedOptions.map((option) => option.name),
        ])
    )

    useEffect(() => {
        if (inputValue === '' || inputValue.length < 3) {
            setFetchedOptions([])
            return
        }

        apiNinjasClient
            .get<City[]>(`city?name=${inputValue}&country=PL&limit=5`)
            .then((response: AxiosResponse<City[]>) => {
                setFetchedOptions(response.data)
            })
            .catch((error: AxiosError) => {
                console.error(error)
            })
    }, [inputValue])

    return (
        <div className="cities-autocomplete">
            <Autocomplete
                multiple
                id="cities-autocomplete"
                options={options}
                getOptionLabel={(option) => option} // options are now strings, so return the option directly
                filterSelectedOptions
                value={selectedPlaces}
                onChange={(_, newValue) => {
                    if (newValue.length <= maximumCitiesLimit) {
                        onSelectPlace(newValue)
                    }
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                isOptionEqualToValue={(option, value) => option === value} // compare city names directly
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
