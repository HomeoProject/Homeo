import { Autocomplete, TextField } from '@mui/material'
import { useDictionaryContext } from '../Context/DictionaryContext'
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

  const { dictionary } = useDictionaryContext()

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
          label={dictionary.languagesSpoken}
          placeholder={dictionary.languagesSearch}
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  )
}

export default LanguagesAutocomplete
