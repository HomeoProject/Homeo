import '../style/scss/AboutPage.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Developer } from '../types/types'
import { developers } from '../Data/data'
import greenIcon from '../Assets/icon-cut-green.png'
import PersonIcon from '@mui/icons-material/Person'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import BuildIcon from '@mui/icons-material/Build'
import karolImg from '../Assets/Karol.jpg'
import maciejImg from '../Assets/Maciej.jpg'
import piotrImg from '../Assets/Piotr.jpg'

const AboutPage = () => {
  const [developer, setDeveloper] = useState<Developer>(developers[0])
  const [photoStyle, setPhotoStyle] = useState<string>('activate')

  const handleDeveloperChange = (name: string) => {
    setPhotoStyle('activate')
    setPhotoStyle('rotated')
    setDeveloper(developers.find((dev) => dev.name === name) || developers[0])
    setTimeout(() => {
      setPhotoStyle('deactivate')
    }, 150)
  }

  return (
    <div className="About">
      <div className="about-description">
        <div className="about-description-header">
          <span className="about-description-header-value">
            <img
              className="about-description-header-value-logo"
              src={greenIcon}
              alt="icon"
            />
            <p className="about-description-header-value-text">What</p>
            <p className="about-description-header-value-text">about</p>
            <p className="about-description-header-value-text">that</p>
            <span className="about-description-header-value-title">Homeo</span>
            <p className="about-description-header-value-text">?</p>
          </span>
        </div>
        <p className="about-description-value">
          Homeo is a project made with passion by a group of three students from
          the University of Gdańsk. Our main aim? Crafting a web application
          that simplifies the process of finding optimal assistance. The
          application is designed to be user-friendly and intuitive. We hope
          that you will find it useful and that it will help you find what
          you're looking for.
        </p>
      </div>
      <div className="about-developers-choice">
        <img
          src={piotrImg}
          className="about-developers-choice-developer"
          onClick={() => handleDeveloperChange('Piotr Damrych')}
        />
        <div className="about-developers-choice-divider" />
        <img
          src={karolImg}
          className="about-developers-choice-developer"
          onClick={() => handleDeveloperChange('Karol Wiśniewski')}
        />
        <div className="about-developers-choice-divider" />
        <img
          src={maciejImg}
          className="about-developers-choice-developer"
          onClick={() => handleDeveloperChange('Maciej Słupianek')}
        />
      </div>
      <div className="about-developers-info">
        <img
          src={developer.image}
          className={'about-developers-info-photo' + ` ${photoStyle}`}
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
