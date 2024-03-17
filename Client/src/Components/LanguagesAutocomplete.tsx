import { Autocomplete, TextField } from '@mui/material'
import isoLangs from 'iso-639-1'
import { useMemo } from 'react'

type LanguagesAutocompleteProps = {
    selectedLanguages: string[]
    onSelectLanguage: (languages: string[]) => void
}

const LanguagesAutocomplete = ({
    selectedLanguages,
    onSelectLanguage,
}: LanguagesAutocompleteProps) => {
    const languages = useMemo(() => {
        return isoLangs.getAllNames()
    }, [])

    const maximumLanguagesLimit = 6

    return (
        <Autocomplete
            multiple
            id="languages"
            options={languages}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(_, newValue) => {
                // Enforce the maximum limit of languages and prevent duplicates
                if (newValue.length <= maximumLanguagesLimit) {
                    onSelectLanguage(newValue)
                }
            }}
            ListboxProps={{
                style: {
                    maxHeight: 160,
                },
            }}
            value={selectedLanguages}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Languages I can speak"
                    placeholder="Search for languages (max 6)..."
                    InputLabelProps={{ shrink: true }}
                />
            )}
        />
    )
}

export default LanguagesAutocomplete
