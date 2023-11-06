import {useRef, useState} from 'react'

import UserCard from './UserCard'
import '../style/scss/components/UserCardDialog.scss'

import Dialog from '@mui/material/Dialog'
import Card from '@mui/material/Card'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send';

export interface SimpleDialogProps {
  open: boolean
  handleClose: () => void
}

const SimpleDialog = (props: SimpleDialogProps) => {
  const { open, handleClose } = props
  const accrodionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [openAccordion, setOpenAccordion] = useState(false)

  const handleOpenAccrordion = () => {
    if(!openAccordion) {
      accrodionRef.current?.scrollIntoView({ behavior: 'smooth' }) 
    } else {
      cardsRef.current?.scrollIntoView({ behavior: 'smooth'})
    }

    setOpenAccordion(!openAccordion)
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth={'xl'}
      className="dialog"
    >
      <div className='before-simple-dialog'>
      <div className="SimpleDialog" ref={cardsRef}>
        <UserCard isDialog={true}/>
        <Card
          sx={{
            margin: '185px 0 0 20px',
            padding: '15px 30px 15px 30px',
            height: '335px',
          }}
        >
          <div className="simple-dialog-container">
            <div className="simple-dialog-container-row">
              <span className="simple-dialog-container-row-key">About me:</span>
              <span className="simple-dialog-container-row-value">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad odio
                nemo rerum similique soluta. Asperiores voluptates quas
                consequuntur nam repellendus cumque ipsam iusto tempora quae
                veniam magni excepturi, esse aliquam!
              </span>
            </div>
            <div className="simple-dialog-container-row">
              <span className="simple-dialog-container-row-key">
                Experience:
              </span>
              <span className="simple-dialog-container-row-value">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad hic
                itaque veniam animi. Amet, in illo suscipit repellat fuga veniam
                incidunt cum nam iure facere? Ipsum voluptas reprehenderit omnis
                veritatis.
              </span>
            </div>
            <div className="simple-dialog-container-row">
              <span className="simple-dialog-container-row-key">
                Why should you hire me:
              </span>
              <span className="simple-dialog-container-row-value">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                mollitia accusantium eos ducimus veniam. Deleniti tenetur
                adipisci tempora? Porro, tempore! Necessitatibus, voluptates
                dolore nostrum adipisci optio temporibus autem illo inventore?
              </span>
            </div>
          </div>
        </Card>
      </div>
      <div className="accordion">
        <Accordion sx={{ width: '880px' }} ref={accrodionRef}>
          <AccordionSummary>
            <div className="accordion-summary">
              <Button variant="contained" color="primary" onClick={handleOpenAccrordion} sx={{fontWeight: 700}}>
                I want to hire you
                <ExpandMoreIcon sx={{
                  transition: '0.2s ease-in-out', 
                  transform: (openAccordion) ? 'rotate(180deg)' : ''
                  }}/>
              </Button>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordion-form">
              <div className='accordion-form-description'>
                <div className='accordion-form-description-value'>
                  <span>
                  Here you write a{' '}
                    <span className='accordion-form-description-value-bold'>
                    description
                    </span>
                  {' '}of your problem. In it, you should try to explain 
                  what you need as precise as possible. Remember - the more information 
                  about the problem you provide, the better chances you your problem
                  will be fixed!
                  </span>
                </div>
              </div>
              <div className="accordion-form-details">
                <TextField
                  label="Description of your problem"
                  variant="outlined"
                  multiline
                  minRows={6}
                />
                <div>
                  <input type="checkbox" />
                  <span>
                    I have read and agreed to the Terms and Conditions
                    <span>
                      *
                    </span>
                  </span>
                </div>
                <div>
                  <Button variant='contained' sx={{fontWeight: 700, width: '100%'}}>
                    <span className='accordion-form-details-button'>
                      Send <SendIcon fontSize='small' sx={{padding: '0 0 0 5px'}}/>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      </div> 
    </Dialog>
  )
}

export default SimpleDialog
