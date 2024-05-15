import '../style/scss/ChatPageEmpty.scss'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

const ChatPageEmpty = () => {
  const { dictionary } = useDictionaryContext()

  return (
    <div className="ChatPageEmpty">
      <div className="chat-page-empty-content">
        <h1 className="chat-page-empty-content-header">
          {dictionary.noChatsYet}
        </h1>
        <span className="chat-page-empty-content-1stline">
          {dictionary.itsNiceToChat}
        </span>
        <span className="chat-page-empty-content-2ndline">
          {dictionary.searchForSomeone}
        </span>
        <Link to="/adverts" className="chat-page-empty-search-link">
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginTop: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              zIndex: 1,
            }}
          >
            {dictionary.searchWord}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ChatPageEmpty
