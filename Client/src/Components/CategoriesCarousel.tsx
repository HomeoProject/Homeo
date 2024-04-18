import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import '../style/scss/components/CategoriesCarousel.scss'
import { useCategoriesContext } from '../Context/CategoriesContext'

type ItemProps = {
  item: {
    id: number
    name: string
    description: string
    image: string
  }
}

function Item(props: ItemProps) {
  return (
    <a className="card" href={'/'}>
      <img src={props.item.image} alt={props.item.name} />
      <div className="card-body">
        <b className="card-title">{props.item.name}</b>
        <p className="card-text">{props.item.description}</p>
      </div>
    </a>
  )
}

const CategoriesCarousel = () => {
  const { categories } = useCategoriesContext()

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 570, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }

  return (
    <div className="CategoriesCarousel">
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={false}
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        keyBoardControl={false}
        transitionDuration={500}
        containerClass="carousel-container"
        renderDotsOutside={false}
        customTransition="transform 300ms ease-in-out"
      >
        {categories.map((category) => (
          <Item key={category.id} item={category} />
        ))}
      </Carousel>
    </div>
  )
}

export default CategoriesCarousel
