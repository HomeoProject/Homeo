import { Autocomplete, TextField } from '@mui/material'
import apiClient from '../AxiosClients/apiClient'
import { useEffect, useState } from 'react'

type UsersAutocompleteProps = {
  onSelectUser: (user: string) => void
}

const UsersAutocomplete = ({ onSelectUser }: UsersAutocompleteProps) => {
  const [fetchedOptions, setFetchedOptions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    if (inputValue === '' || inputValue.length < 3) {
      setFetchedOptions([])
      return
    }

    const fetchUsers = async () => {
      try {
        const usersResponse = await apiClient.get('/users/')
        console.log(usersResponse.data)
        setFetchedOptions(usersResponse.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUsers()
  }, [inputValue])

  return (
    <Autocomplete
      id="languages"
      options={fetchedOptions}
      getOptionLabel={(option) => option}
      filterSelectedOptions
      onChange={(_, newValue) => {
        if (newValue !== null) {
          onSelectUser(newValue)
        }
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      ListboxProps={{
        style: {
          maxHeight: 160,
        },
      }}
      value={inputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label="User"
          placeholder="Search for user..."
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  )
}

export default UsersAutocomplete
