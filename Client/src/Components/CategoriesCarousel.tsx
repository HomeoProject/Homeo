import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import '../style/scss/components/CategoriesCarousel.scss'

type ItemProps = {
    item: {
        name: string
        description: string
        image: string
        link: string
    }
}

function Item(props: ItemProps) {
    return (
        <a className="card" href={props.item.link}>
            <img src={props.item.image} alt={props.item.name} />
            <div className="card-body">
                <b className="card-title">{props.item.name}</b>
                <p className="card-text">{props.item.description}</p>
            </div>
        </a>
    )
}

const CategoriesCarousel = () => {
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

    const items = [
        {
            name: 'Plumbing',
            description: '19632 adverts',
            image: 'https://emast.pl/media//articles/article/narzedzia-hydraulika.jpg',
            link: '/categories/plumbing',
        },
        {
            name: 'Roofing',
            description: '2132 adverts',
            image: 'https://static.oferteo.pl/images/hero/kompleksowa-budowa-dachu-zlecenia-oferty-a.jpg',
            link: '/categories/roofing',
        },
        {
            name: 'Electricity',
            description: '8721 adverts',
            image: 'https://www.mgprojekt.com.pl/blog/wp-content/uploads/2018/01/rozdzielnica.jpg',
            link: '/categories/electricity',
        },
        {
            name: 'Painting',
            description: '11236 adverts',
            image: 'https://futureinvestment.pl/wp-content/uploads/2019/05/Kurs_Malarz_tapeciarz-2.jpg',
            link: '/categories/painting',
        },
        // {
        //   name: "Item 5",
        //   description: "Description for item 5",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 6",
        //   description: "Description for item 6",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 7",
        //   description: "Description for item 7",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 8",
        //   description: "Description for item 8",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 9",
        //   description: "Description for item 9",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 10",
        //   description: "Description for item 10",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 11",
        //   description: "Description for item 11",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
        // {
        //   name: "Item 12",
        //   description: "Description for item 12",
        //   image: "https://picsum.photos/seed/picsum/200/300"
        // },
    ]

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
                // removeArrowOnDeviceType={["tablet", "mobile"]}
                // dotListClass="custom-dot-list-style"
                // itemClass="carousel-item-padding-20-px"
                // partialVisible={true}
                renderDotsOutside={false}
                customTransition="transform 300ms ease-in-out"
            >
                {items.map((item, index) => (
                    <Item key={index} item={item} />
                ))}
            </Carousel>
        </div>
    )
}

export default CategoriesCarousel
