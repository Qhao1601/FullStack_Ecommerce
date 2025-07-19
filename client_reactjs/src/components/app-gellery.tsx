import type { IAlbum } from "@/interfaces/products/products.interface"
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, CarouselItem, type CarouselApi, } from "./ui/carousel"
import { memo, useEffect, useMemo, useState } from "react"



interface IGelleryProps {
    images: IAlbum[]
}



const AppGellery = ({ images }: IGelleryProps) => {

    const [mainApi, setMainApi] = useState<CarouselApi>()
    const [thumbApi, setThumbApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState<number>(0)


    const mainImages = useMemo(() => images.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-square w-full cursor-pointer">

            <img src={image.fullPath}
                alt={image.fullPath}
                className="object-cover size-full" />

        </CarouselItem>
    )), [images])

    const thumbImages = useMemo(() => images.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-square w-full basis-1/4 cursor-pointer p-[10px]" onClick={() => handleClick(index)}>

            <img src={image.fullPath}
                alt={image.fullPath}
                className={`object-cover size-full ${index === current ? "border-2 border-[#629a23]" : ""}`} />

        </CarouselItem>
    )), [images, current])

    useEffect(() => {
        if (!mainApi || !thumbApi) return
        const handleTopSelected = () => {
            const selected = mainApi.selectedScrollSnap()
            setCurrent(selected)
            thumbApi.scrollTo(selected)
        }
        const handleBottomSelect = () => {
            const selected = thumbApi.selectedScrollSnap()
            setCurrent(selected)
            thumbApi.scrollTo(selected)
        }

        mainApi.on("select", handleTopSelected)
        thumbApi.on("select", handleBottomSelect)

        return () => {
            mainApi.off("select", handleTopSelected)
            thumbApi.off("select", handleBottomSelect)
        }
    }, [mainApi, thumbApi])

    const handleClick = (index: number) => {
        console.log(index)
        if (!mainApi || !thumbApi) return
        thumbApi?.scrollTo(index)
        mainApi?.scrollTo(index)
        setCurrent(index)
    }
    return (
        <>
            <div className="w-full">
                <Carousel setApi={setMainApi}>
                    <CarouselContent>
                        {mainImages}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <Carousel setApi={setThumbApi} >
                    <CarouselContent className="p-[10px]">
                        {thumbImages}
                    </CarouselContent>
                </Carousel>
            </div>


        </>
    )

}






export default memo(AppGellery)