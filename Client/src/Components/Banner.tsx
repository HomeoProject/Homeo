import '../style/scss/components/Banner.scss'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

type BannerProps = {
    variant: 'info' | 'warning'
    headline?: string
    text: string
    link?: string
    linkText?: string
}

const Banner = ({ variant, headline, text, link, linkText }: BannerProps) => {
    switch (variant) {
        case 'info':
            return (
                <div className="Banner">
                    <div className="banner-standard">
                        {headline ? (
                            <>
                                <div className="banner-headline-wrapper">
                                    <InfoOutlinedIcon />
                                    <b className="banner-headline">
                                        {headline}
                                    </b>
                                </div>
                                <p className="banner-text-secondary">{text}</p>
                            </>
                        ) : (
                            <div className="banner-text-wrapper">
                                <InfoOutlinedIcon />
                                <p className="banner-text-primary">{text}</p>
                            </div>
                        )}
                        {link && (
                            <a href={link} className="banner-link">
                                {linkText}
                            </a>
                        )}
                    </div>
                </div>
            )
        case 'warning':
            return (
                <div className="Banner">
                    <div className="banner-warning">
                        {headline ? (
                            <>
                                <div className="banner-headline-wrapper">
                                    <WarningAmberIcon />
                                    <b className="banner-headline">
                                        {headline}
                                    </b>
                                </div>
                                <p className="banner-text-secondary">{text}</p>
                            </>
                        ) : (
                            <div className="banner-text-wrapper">
                                <WarningAmberIcon />
                                <p className="banner-text-primary">{text}</p>
                            </div>
                        )}
                        {link && (
                            <a href={link} className="banner-link">
                                {linkText}
                            </a>
                        )}
                    </div>
                </div>
            )
    }
}

export default Banner
