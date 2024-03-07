import { useState, useEffect } from 'react'
import { TextField, Autocomplete } from '@mui/material'

interface Place {
    label: string
    value: string
}

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
                option.value,
                option,
            ])
        ).values(),
    ]

    useEffect(() => {
        if (!window.google || inputValue === '') {
            setFetchedOptions([])
            return
        }

        const service = new window.google.maps.places.AutocompleteService()
        service.getPlacePredictions(
            {
                input: inputValue,
                types: ['(cities)'],
                componentRestrictions: { country: 'pl' },
            },
            (results, status) => {
                if (
                    status ===
                        window.google.maps.places.PlacesServiceStatus.OK &&
                    results
                ) {
                    setFetchedOptions(
                        results.map((result) => ({
                            label: result.description,
                            value: result.place_id,
                        }))
                    )
                }
            }
        )
    }, [inputValue])

    return (
        <div className="google-places-autocomplete">
            <Autocomplete
                multiple
                id="google-places-autocomplete"
                options={options}
                getOptionLabel={(option) => option.label}
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
                    option.value === value.value
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search for cities..."
                        label="Cities I can work in"
                        InputLabelProps={{ shrink: true }}
                    />
                )}
            />
        </div>
    )
}

export default CustomGooglePlacesAutocomplete
