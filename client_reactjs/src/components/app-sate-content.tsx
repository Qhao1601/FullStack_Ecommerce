import DOMPurify from 'dompurify'

interface IAppSafeHtml {
    html: string,
    className: string
}

const AppSafeHtml = ({ html, className }: IAppSafeHtml) => {
    return (
        <div className={className}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(html || '')
            }}>
        </div>
    )
}


export default AppSafeHtml