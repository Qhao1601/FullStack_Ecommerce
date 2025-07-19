export interface ISlides {
    id: number;
    name: string;
    keyword: string;
    description: string;
    item: ISlideItem[];
    setting?: string;
    short_code?: string;
    publish: number;
}

export interface ISlideItem {
    image: File | string
    description?: string
    fullPath: string
}

export interface ISlidesRequest {
    id: number
    name: string;
    keyword: string;
    description: string;
    item: ISlideItem[];
    setting?: string;
    short_code?: string;
    publish: number;
}
