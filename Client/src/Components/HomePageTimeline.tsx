import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import HotelIcon from '@mui/icons-material/Hotel'
import RepeatIcon from '@mui/icons-material/Repeat'
import Typography from '@mui/material/Typography'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import CreateRounded from '@mui/icons-material/CreateRounded'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'

const HomePageTimeline = () => {
    return (
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    width: '100%',
                },
            }}
        >
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ display: 'none' }}
                ></TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <PersonSearchRoundedIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '30px', px: 2 }}>
                    <Typography fontFamily={'Gabarito'}>
                        Choose a person you want to work with
                    </Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ display: 'none' }}
                ></TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="primary">
                        <CreateRounded />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '30px', px: 2 }}>
                    <Typography fontFamily={'Gabarito'}>
                        Fill out a short form
                    </Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ display: 'none' }}
                ></TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="primary">
                        <HotelIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '30px', px: 2 }}>
                    <Typography fontFamily={'Gabarito'}>
                        Sort out the details
                    </Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ display: 'none' }}
                ></TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                    <TimelineDot color="primary">
                        <RepeatIcon />
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent sx={{ py: '30px', px: 2 }}>
                    <Typography fontFamily={'Gabarito'}>
                        Get the result you deserve
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    )
}

export default HomePageTimeline
