import '../style/scss/components/UsersAccordion.scss'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import { CustomUser } from '../types/types'
import { useDictionaryContext } from '../Context/DictionaryContext'
import '../style/scss/components/CategoriesAccordion.scss'

type UsersAccordionProps = {
  users: CustomUser[]
  handleApporveUser: (id: string, isApproved: boolean) => void
  handleBlockUser: (id: string, isBlocked: boolean) => void
}

const UsersAccordion = ({
  users,
  handleApporveUser,
  handleBlockUser,
}: UsersAccordionProps) => {
  const { dictionary } = useDictionaryContext()

  return (
    <div className="UsersAccordion">
      {users.length ? (
        users.map((user) => {
          return (
            <Accordion key={user.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="users-accordion-label">
                  <img
                    className="users-accordion-label-image"
                    src={user.avatar}
                    alt="category-photo"
                  />
                  {user.id} -{' '}
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="users-accordion-details">
                  <div className="users-accordion-details-container">
                    <img
                      src={user.avatar}
                      alt="category-photo"
                      className="users-accordion-details-image"
                    />
                    <div className="users-accordion-details-fields">
                      <div className="users-accordion-details-fields-container name">
                        <span className="users-accordion-details-fields-container-key">
                          id:
                        </span>
                        <span>{user.id}</span>
                      </div>
                      <div className="users-accordion-details-fields-container name">
                        <span className="users-accordion-details-fields-container-key">
                          {dictionary.firstNameWord}:&nbsp;
                        </span>
                        <span>{user.firstName}</span>
                      </div>
                      <div className="users-accordion-details-fields-container name">
                        <span className="users-accordion-details-fields-container-key">
                          {dictionary.lastNameWord}:&nbsp;
                        </span>
                        <span>{user.lastName}</span>
                      </div>
                      <div className="users-accordion-details-fields-container name">
                        <span className="users-accordion-details-fields-container-key">
                          Email:
                        </span>
                        <span>{user.email}</span>
                      </div>
                      <div className="users-accordion-details-fields-container name">
                        <span className="users-accordion-details-fields-container-key">
                          {dictionary.phoneNumberWord}:&nbsp;
                        </span>
                        <span>{user.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="users-accordion-details-actions">
                    {!user.isApproved ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApporveUser(user.id, true)}
                      >
                        {dictionary.approveWord}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleApporveUser(user.id, false)}
                      >
                        {dictionary.revokeApproval}
                      </Button>
                    )}
                    {!user.isBlocked ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleBlockUser(user.id, true)}
                      >
                        {dictionary.blockWord}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleBlockUser(user.id, false)}
                      >
                        {dictionary.unblockWord}
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )
        })
      ) : (
        <div className="users-accordion-exaption">
          {dictionary.noUsersFound}
        </div>
      )}
    </div>
  )
}

export default UsersAccordion
