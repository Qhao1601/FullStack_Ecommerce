

const serverUrl = import.meta.env.VITE_SERVER_URL

export const write_url = (canonical: string, id: number, module: string) => {
    const prefix: Record<string, string> = {
        product_catalogue: 'pc',
        product: 'p',
        artical_catalogue: 'ac',
        artical: 'a',
        menu: 'm'

    }
    const modulePefix: string = prefix[module] || 'p'
    return `${serverUrl}/${modulePefix}/${canonical}/${id}.html`
}


export const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(price))
}

export const stripTags = (html: string) => {
    if (!html) return ''
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''

}


export const buildUrlWithQueryString = (endpoint: string, queryParams?: Record<string, string>) => {
    const basePath = `${endpoint}`
    if (!queryParams) return basePath;
    const queryString = new URLSearchParams(queryParams).toString()
    return `${basePath}${queryString ? `?${queryString}` : ""}`
}