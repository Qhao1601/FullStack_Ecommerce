import { Phone } from "lucide-react"

const Footer = () => {
    return (
        <>
            <div id="footer" className="bg-[#f3f4f6] py-[40px]">
                <div className="container">
                    <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-1">
                            <div className="footer-heading text-lg font-semibold mb-4 text-gray-800" >Tổng đài hỗ trợ miễn phí</div>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <span className="mr-2 size-[50px] text-center border rounded-[50% relative block]">
                                        <Phone className="absolute top-[50%] left-[50%] transform -translate-x-1/2 "></Phone>
                                    </span>
                                    <div className="text-sm text-gray-600">
                                        <div className="text-sm">
                                            Have Question? Call Us 24/7
                                        </div>
                                        <div className="font-semibold text-[30px] text-[#629d23]">
                                            -0392967795
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <div className="mb-[10px]">
                                        Monday - Friday: <span className="font-medium">6:00am - 18:00am</span>
                                    </div>
                                    <div className="mb-[10px]">
                                        Saturday <span className="font-medium"> 7:30am - 4:00am</span>
                                    </div>
                                    <div>
                                        Sunday <span className="font-medium">Đóng cửa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="footer-heading text-lg font-semibold mb-4 text-gray-800">
                                Thông tin và chính sách
                            </div>
                            <ul className="space-y-2">
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Mua hàng và thanh toán online</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Mua hàng trả góp online</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Mua hàng trả góp bằng thẻ tín dụng</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Tra thông tin bảo hành</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Tra cứu hóa đơn điện tử</a></li>
                            </ul>
                        </div>
                        <div className="col-span-1">
                            <div className="footer-heading text-lg font-semibold mb-4 text-gray-800">
                                Dịch vụ và thông tin khác
                            </div>
                            <ul className="space-y-2">
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Khách hàng và doanh nghiệp (B2B)</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Ưu đãi thanh toán</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Quy chế hoạt động</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Chính sách bảo hành</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Tuyển dụng</a></li>
                            </ul>
                        </div>
                        <div className="col-span-1">
                            <div className="footer-heading text-lg font-semibold mb-4 text-gray-800">
                                Liên hệ và mua hàng
                            </div>
                            <ul className="space-y-2">
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Chăm sóc khách hàng</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Chính sách vận chuyển, thanh toán</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Chính sách bảo mật thông tin</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Khách hàng thân thiết</a></li>
                                <li><a className="text-gray-600 hover:text-gray-800 text-sm" href="">Chính sách và quy định chung</a></li>
                            </ul>
                        </div>
                        <div className="col-span-1">
                            <div className="footer-heading text-lg font-semibold mb-4 text-gray-800">
                                Kết nối với quochaoStore
                            </div>
                            <div className="text-sm text-gray-600 mb-[15px]">
                                Trung tâm bảo hành apple luôn kết nối yêu thương
                            </div>
                            <div className="relative mb-[15px]">
                                <input type="text" className="h-[50px] w-full flex-1 px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-green-500 text-sm" placeholder="Mới bạn nhập vào đây" />
                                <button className="bg-[#629d23] text-white px-4 py-2 rounded-[5px] hover:bg-[#629d23] text-sm font-semibold absolute top-[50%] right-[10px] transform -translate-y-1/2">Tìm kiếm</button>
                            </div>
                            <div className="text-sm text-gray-600 mb-[15px]">
                                Xin cảm ơn bạn đã đến với chúng tôi
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright py-[15px] bg-white">
                    <div className="container text-center">
                        Coppyright 2025 QuocHaoVietNam. All right reserved.
                    </div>
                </div>
            </div>
        </>
    )
}


export default Footer