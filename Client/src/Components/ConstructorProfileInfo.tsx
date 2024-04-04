import { Constructor } from '../types/types'
import PersonIcon from '@mui/icons-material/Person'
import BuildIcon from '@mui/icons-material/Build'
import PlumbingIcon from '@mui/icons-material/Plumbing'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PublicIcon from '@mui/icons-material/Public'
import { useDictionaryContext } from '../Context/DictionaryContext'
import '../style/scss/components/ConstructorProfileInfo.scss'

type ConstructorProfileInfoProps = {
  constructorData: Constructor
}

const ConstructorProfileInfo = ({
  constructorData,
}: ConstructorProfileInfoProps) => {
  const { dictionary } = useDictionaryContext()

  return (
    <div className="ConstructorProfileInfo">
      <section className="constructor-page-main-section">
        <div className="constructor-page-main-section-title-wrapper">
          <PersonIcon
            className="constructor-page-main-section-icon"
            color="primary"
          />
          <h1 className="constructor-page-main-section-title">
            {dictionary.aboutMe}
          </h1>
        </div>
        <p className="constructor-page-main-section-content">
          {constructorData.aboutMe}
        </p>
        <div className="constructor-page-main-section-title-wrapper">
          <BuildIcon
            className="constructor-page-main-section-icon"
            color="primary"
          />
          <h1 className="constructor-page-main-section-title">
            {dictionary.experience}
          </h1>
        </div>
        <p className="constructor-page-main-section-content">
          {constructorData.experience}
        </p>
        <div className="constructor-page-main-section-title-wrapper">
          <PlumbingIcon
            className="constructor-page-main-section-icon"
            color="primary"
          />
          <h1 className="constructor-page-main-section-title">
            {dictionary.categories}
          </h1>
        </div>
        <p className="constructor-page-main-section-content">
          {constructorData.categories.map((category, index) => {
            if (index === constructorData!.categories.length - 1)
              return category.name
            return `${category.name}, `
          })}
        </p>
        <div className="constructor-page-main-section-title-wrapper">
          <LocationCityIcon
            className="constructor-page-main-section-icon"
            color="primary"
          />
          <h1 className="constructor-page-main-section-title">
            {dictionary.workingCities}
          </h1>
        </div>
        <p className="constructor-page-main-section-content">
          {constructorData.cities.map((city, index) => {
            if (index === constructorData!.cities.length - 1) return city
            return `${city}, `
          })}
        </p>
        <div className="constructor-page-main-section-title-wrapper">
          <PublicIcon
            className="constructor-page-main-section-icon"
            color="primary"
          />
          <h1 className="constructor-page-main-section-title">
            {dictionary.languages}
          </h1>
        </div>
        <p className="constructor-page-main-section-content">
          {constructorData.languages.map((language, index) => {
            if (index === constructorData.languages.length - 1) return language
            return `${language}, `
          })}
        </p>
      </section>
    </div>
  )
}

export default ConstructorProfileInfo
