import '../style/scss/components/ChatConstructorsList.scss'
import { ChatParticipant } from '../types/types'

type ChatConstructorsListProps = {
  participants: ChatParticipant[]
}

const ChatConstructorsList = ({ participants }: ChatConstructorsListProps) => {
  console.log(participants)
  return (
    <div className="ChatConstructorList">
      <div></div>
    </div>
  )
}

export default ChatConstructorsList
