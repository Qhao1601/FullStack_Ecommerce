import { memo } from "react";
import type React from "react";


interface IBannerItemProps {
    image?: string,
    children: React.ReactNode
}

const BannerItem = ({ image, children }: IBannerItemProps) => {
    return (
        <>
            <div className="banner-item relative">
                <span className="block">
                    <img src={image} alt={image} />
                </span>
                <div className="absolute top-[15%] left-[25px]">
                    {children}
                </div>
            </div>
        </>
    )
}

export default memo(BannerItem)