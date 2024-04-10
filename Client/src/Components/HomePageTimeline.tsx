import { useDictionaryContext } from '../Context/DictionaryContext'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import Typography from '@mui/material/Typography'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import CreateRounded from '@mui/icons-material/CreateRounded'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import TagFacesRoundedIcon from '@mui/icons-material/TagFacesRounded'

const centeredDotStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '5px',
  '& > .MuiSvgIcon-root': {
    marginBottom: '0',
  },
}

const HomePageTimeline = () => {
  const { dictionary } = useDictionaryContext()

  return (
    <Timeline sx={{ margin: '0', padding: '0' }}>
      <TimelineItem>
        <TimelineOppositeContent sx={{ display: 'none' }} />
        <TimelineSeparator>
          <TimelineDot color="primary" sx={centeredDotStyle}>
            <PersonSearchRoundedIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: 0, px: 2 }}>
          <Typography
            fontFamily={'Gabarito'}
            paddingTop={'20px'}
            fontSize={'calc(80% + 0.3vw)'}
          >
            {dictionary.chooseTimeline}
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent sx={{ display: 'none' }} />
        <TimelineSeparator>
          <TimelineConnector sx={{ height: '21px' }} />
          <TimelineDot color="primary" sx={centeredDotStyle}>
            <CreateRounded />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: 0, px: 2 }}>
          <Typography
            fontFamily={'Gabarito'}
            paddingTop={'41px'}
            fontSize={'calc(80% + 0.3vw)'}
          >
            {dictionary.formTimeline}
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent sx={{ display: 'none' }} />
        <TimelineSeparator>
          <TimelineConnector sx={{ height: '30px' }} />
          <TimelineDot color="primary" sx={centeredDotStyle}>
            <ForumRoundedIcon />
          </TimelineDot>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: 0, px: 2 }}>
          <Typography
            fontFamily={'Gabarito'}
            paddingTop={'49px'}
            fontSize={'calc(80% + 0.3vw)'}
          >
            {dictionary.detailsTimeline}
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent sx={{ display: 'none' }} />
        <TimelineSeparator>
          <TimelineConnector
            sx={{ bgcolor: 'secondary.main', height: '30px' }}
          />
          <TimelineDot color="primary" sx={centeredDotStyle}>
            <TagFacesRoundedIcon />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent sx={{ py: 0, px: 2 }}>
          <Typography
            fontFamily={'Gabarito'}
            paddingTop={'49px'}
            fontSize={'calc(80% + 0.3vw)'}
          >
            {dictionary.detailsResult}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

export default HomePageTimeline
