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
        <UserCard />
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
              <Button variant="contained" color="secondary" onClick={handleOpenAccrordion}>
                <ExpandMoreIcon sx={{
                  transition: '0.2s ease-in-out', 
                  transform: (openAccordion) ? 'rotate(180deg)' : ''
                  }}/>
              </Button>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordion-form">
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      </div> 
    </Dialog>
  )
}

export default SimpleDialog
