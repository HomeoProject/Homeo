import '../style/scss/AboutPage.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Developer } from '../types/types'
import greenIcon from '../Assets/icon-green.png'
import PersonIcon from '@mui/icons-material/Person'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import BuildIcon from '@mui/icons-material/Build'
import karolImg from '../Assets/Karol.jpg'
import maciejImg from '../Assets/Maciej.jpg'
import piotrImg from '../Assets/Piotr.jpg'

const AboutPage = () => {
    const developers = [
        {
            name: 'Piotr Damrych',
            github: 'https://github.com/piotrd22',
            linkedin: 'https://www.linkedin.com/in/piotr-damrych-146a1421a/',
            image: piotrImg,
            role: 'Backend Engineer',
        },
        {
            name: 'Karol Wiśniewski',
            github: 'https://github.com/Karol-Wisniewski',
            linkedin: 'https://www.linkedin.com/in/karol-wisniewski-722588267/',
            image: karolImg,
            role: 'Fullstack Engineer',
        },
        {
            name: 'Maciej Słupianek',
            github: 'https://github.com/M-ac-i-ej-s',
            linkedin:
                'https://www.linkedin.com/in/maciej-s%C5%82upianek-686246237/',
            image: maciejImg,
            role: 'Frontend Engineer',
        },
    ]

    const [developer, setDeveloper] = useState<Developer>(developers[0])
    const [photoStyle, setPhotoStyle] = useState<{
        rotate: string
        transition: string
    }>({ rotate: '0deg', transition: '0.5s ease-in-out' })

    const handleDeveloperChange = (index: number) => {
        setPhotoStyle({ rotate: '0deg', transition: '0.5s ease-in-out' })
        setPhotoStyle({ rotate: '360deg', transition: '0.5s ease-in-out' })
        setDeveloper(developers[index])
        setTimeout(() => {
            setPhotoStyle({ rotate: '0deg', transition: 'none' })
        }, 500)
    }

    return (
        <div className="About">
            <div className="about-description">
                <div className="about-description-header">
                    <div className="about-logo">
                        <img
                            className="about-logo-value"
                            src={greenIcon}
                            alt="icon"
                        />
                    </div>
                    <span className="about-description-header-value">
                        What about that&nbsp;
                        <span className="about-description-header-value-title">
                            Homeo
                        </span>
                        &nbsp;?
                    </span>
                </div>
                <div className="about-description-value">
                    Homeo is a project made with passion by a group of three
                    students from the University of Gdańsk. Our main aim?
                    Crafting a web application that simplifies the process of
                    finding optimal assistance. The application is designed to
                    be user-friendly and intuitive. We hope that you will find
                    it useful and that it will help you find what you're looking
                    for.
                </div>
            </div>
            <div className="about-developers-choice">
                <img
                    src={piotrImg}
                    className="about-developers-choice-developer"
                    onClick={() => handleDeveloperChange(0)}
                />
                <div className="about-developers-choice-divider" />
                <img
                    src={karolImg}
                    className="about-developers-choice-developer"
                    onClick={() => handleDeveloperChange(1)}
                />
                <div className="about-developers-choice-divider" />
                <img
                    src={maciejImg}
                    className="about-developers-choice-developer"
                    onClick={() => handleDeveloperChange(2)}
                />
            </div>
            <div className="about-developers-info">
                <img
                    src={developer.image}
                    className="about-developers-info-photo"
                    style={photoStyle}
                />
                <div className="about-developers-info-values">
                    <div className="about-developers-info-values-row">
                        <PersonIcon fontSize="large" color="primary" />
                        <span>{developer.name}</span>
                    </div>
                    <div className="about-developers-info-values-row">
                        <GitHubIcon fontSize="large" color="primary" />
                        <Link
                            className="about-developers-info-values-row-link"
                            to={developer.github}
                        >
                            GitHub
                        </Link>
                    </div>
                    <div className="about-developers-info-values-row">
                        <LinkedInIcon fontSize="large" color="primary" />
                        <Link
                            className="about-developers-info-values-row-link"
                            to={developer.linkedin}
                        >
                            LinkedIn
                        </Link>
                    </div>
                    <div className="about-developers-info-values-row">
                        <BuildIcon fontSize="large" color="primary" />
                        <span>{developer.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
