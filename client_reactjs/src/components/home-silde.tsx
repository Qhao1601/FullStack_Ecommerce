import slide1 from "@/assets/slide 1.webp"
import slide2 from "@/assets/slide 2.webp"
import slide3 from "@/assets/slide 3.webp"
import slide4 from "@/assets/slide 4.webp"
import slide5 from "@/assets/slide 5.webp"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
const HomeSlide = () => {
    return (
        <>
            <div className="panel-slide mb-[30px]">
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>
                            <img src={slide1} alt="" />
                        </CarouselItem>
                        <CarouselItem>
                            <img src={slide2} alt="" />
                        </CarouselItem>
                        <CarouselItem>
                            <img src={slide3} alt="" />
                        </CarouselItem>
                        <CarouselItem>
                            <img src={slide4} alt="" />
                        </CarouselItem>
                        <CarouselItem>
                            <img src={slide5} alt="" />
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </>
    )
}


export default HomeSlide