import { Link } from "react-router"
import { Button } from "./ui/button"
import { Menu, Search, ShoppingBag } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery } from "@tanstack/react-query";
import type { IApiMessage, IApiOk, IPaginate } from "@/interfaces/api.interface"
import type { ILoginResponse } from "@/interfaces/auth.interface"
import type { AxiosError } from "axios"
import authService from "@/services/customer/auth.service"
import { AuthStore } from "@/stores/auth.stores"
import { toast } from "sonner"
import { useEffect, useMemo, useRef } from "react"
import type { ICustomer } from "@/interfaces/customer.interface"
import type { IProductCatalogue } from "@/interfaces/products/product-catalogues.interface"
import customerService from "@/services/customer/custom.service"
import { write_url } from "@/utils/helper"
import type { IMenu } from "@/interfaces/menu.interface"
import menuService from "@/services/menus/menu.service"
import { useNavigate } from "react-router"
import { cartStore } from "@/stores/card.store"


const loginSchema = z.object({
    email: z.string().min(2, {
        message: "Bạn phải nhập email.",
    }).email(),
    password: z.string().min(1, { message: "Bạn phải nhập mật khẩu" })
})

const registerSchema = z.object({
    name: z.string().min(2, { message: "Bạn phải nhập họ và tên" }),
    email: z.string().min(2, {
        message: "Bạn phải nhập email.",
    }).email(),
    password: z.string().min(1, { message: "Bạn phải nhập mật khẩu" }),
    re_password: z.string().min(1, { message: "Bạn phải nhập lại mật khẩu" })
}).refine((data) =>
    data.password === data.re_password, {
    message: "Mật khẩu không trùng khớp vui lòng nhập lại",
    path: ['re_password'],
}
);

export type TLoginRequest = z.infer<typeof loginSchema>
export type TRegisterRequest = z.infer<typeof registerSchema>


const Header = () => {
    const { summary } = cartStore()
    const { isAuthenticated, customer, clearAuth } = AuthStore()
    const dialogButton = useRef<HTMLButtonElement>(null)
    const dialogRegisButton = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate();

    // lấy api đăng nhập
    const loginMuation = useMutation<IApiOk<ILoginResponse>, AxiosError<IApiMessage>, TLoginRequest>({
        mutationFn: authService.signin,
    })
    // lấy api đăng xuất
    const logoutMuation = useMutation<IApiMessage, AxiosError<IApiMessage>, unknown>({
        mutationFn: authService.logout,
    })

    // lấy api đăng kí 
    const registerMuation = useMutation<IApiOk<ICustomer>, AxiosError<IApiMessage>, TRegisterRequest>({
        mutationFn: authService.register
    })

    // lấy danh sách nhóm sản phẩm
    const { data: productCatalogues, isLoading } = useQuery<IApiOk<IProductCatalogue[] | IPaginate<IProductCatalogue>>, AxiosError<IApiMessage>>({
        queryKey: ['product_catalogues'],
        queryFn: () => customerService.paginate<IProductCatalogue>('product_catalogues?type=all&level=2')
    })

    const category = useMemo(() => {
        if (productCatalogues && productCatalogues.data) {
            return productCatalogues?.data as IProductCatalogue[]
        }
        return [];
    }, [productCatalogues])

    // lấy danh sách menu
    const { data: menus, isLoading: isMenuLoading } = useQuery<IApiOk<IMenu[] | IPaginate<IMenu>>, AxiosError<IApiMessage>>({
        queryKey: ['menus'],
        queryFn: () => menuService.paginate<IMenu>('menus?type=all&sort_by=id,asc&menu_catalogue_id=1&parent_id=0')
    })

    const memoMenu = useMemo(() => {
        if (menus && menus.data) {
            return menus.data as IMenu[]
        }
        return []
    }, [menus])

    const form = useForm<TLoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const handleLogin = (payload: TLoginRequest) => {
        loginMuation.mutate(payload, {
            onSuccess: (response) => {
                const { accessToken, expiresAt, user: customer } = response.data
                AuthStore.getState().setAuth(accessToken, expiresAt, customer)
                dialogButton.current?.click()
                form.reset()
                toast.success("Đăng nhập vào hệ thống thành công")
            },
            onError: (error) => {
                console.error('Login.Failed', error)
                toast.error("Đăng nhập hệ thống thất bại")
            }
        })
    }

    const handleLogout = () => {
        // clearAuth();
        if (!isAuthenticated) {
            clearAuth()
            navigate('/', { replace: true })
            return false;
        }
        logoutMuation.mutate(undefined, {
            onSuccess: (response) => {
                console.log(response);
                clearAuth()
                toast.success("Đăng xuất thành công")
            },
            onError: (error) => {
                // clearAuth()
                console.error("logout.Failed", error)
                toast.error("Đăng xuất thất bại")
            }
        })
    }

    // đăng kí
    const regisForm = useForm<TRegisterRequest>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            re_password: ""
        },
    })

    const handleRegister = (payload: TRegisterRequest) => {
        registerMuation.mutate(payload, {
            onSuccess: () => {
                dialogRegisButton.current?.click()
                regisForm.reset()
                toast.success("Đăng kí thành công")
            },
            onError: (error) => {
                console.error("faild register", error)
                toast.error("Đăng kí thất bại")
            }
        })
    }

    useEffect(() => {
        console.log(isAuthenticated())
    }, [isAuthenticated()])

    return (
        <>
            <header id="pc-header">
                <div id="header-top" className="bg-[#619d23] py-[12px] text-[#fff]" >
                    <div className="container">
                        <div className="flex justify-between items-center">
                            <span className=" pl-[80px]">Giao nhanh - miễn phí cho đơn hàng 300k - Sản phẩm chính hãng - xuất VAT  - Thu củ đổi mới</span>
                            <span className=" pr-[80px]" >Cần hỗ trợ gọi: 0392967795 - Luôn đồng hành cùng bạn</span>
                        </div>
                    </div>
                </div>
                <div id="header-middle" className="py-[20px]">
                    <div className="container px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex">
                                <Link className="mr-[50px]" to={`/`} >
                                    <img src="https://ekomart-nextjs.vercel.app/assets/images/logo/logo-01.svg" alt="" />
                                </Link>
                                <div className="flex items-center">
                                    <div className="category relative group">
                                        <Button type="button" className="text-[16px] py-[14px] px-[15px] rounded-[5px] bg-[#F3F4F6] h-[50px] gap-[10px] flex items-center cursor-pointer font-[600] text-[#2C3C28] hover:bg-[#629023] hover:text-[#fff]">
                                            <Menu />
                                            <span>Danh mục</span>
                                        </Button>
                                        <div className="absolute top-[100%] left-0 w-[250px] bg-white rounded-[5px] opacity-0 invisible group-hover:visible group-hover:opacity-100 shadow-lg transition-all duration-300 z-10">
                                            {!isLoading && category && (
                                                <ul>
                                                    {category.map((item) => {
                                                        const canonical = write_url(item.canonical, item.id, 'product_catalogue')
                                                        return (
                                                            <li key={item.id} className="group/item">
                                                                <Link className="block py-[12px] px-[20px] group-hover/item:bg-[#619d23] group-hover/item:text-[#fff]" to={`${canonical}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <form className="flex items-center  w-[400px] pr-[50px]" action="">
                                        <div className="relative flex-1">
                                            <input type="text" autoComplete="off" placeholder="Nhập từ vào để tìm kiếm"
                                                className="w-full h-[50px] px-4 text-gray-600 rounded-[5px] bg-[#F3F4F6] border-0 outline-0" />
                                            <Button type="submit" className="absolute top-[50%] transform -translate-[50%] right-0 h-[40px] rounded-[5px] bg-[#619d23] text-[#fff] py-[14px] px-[25px] cursor-pointer ">
                                                <span>Tìm kiếm</span>
                                                <Search />
                                            </Button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {/* kiểm tra trạng thái đăng nhập */}
                                {isAuthenticated() ?
                                    <div className="flex space-x-1 items-center">
                                        <Link to={`customer/infomation`}>
                                            <Button className="relative flex gap-2 items-center rounded-[5px] pr-[30px] pl-[30px] text-black cursor-pointer bg-[#fff] mr-[20px] border border-black hover:bg-[#629023] hover:text-white">
                                                {customer?.name}
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={handleLogout}
                                            className="relative font-medium flex gap-2 items-center rounded-[5px] pr-[30px] pl-[30px] text-black cursor-pointer bg-[#fff]  mr-[20px] border border-black hover:bg-[#629023] hover:text-white">
                                            Đăng xuất
                                        </Button>
                                    </div>
                                    : (
                                        <div className="flex space-x-1 items-center ">
                                            <Dialog >
                                                <DialogTrigger className="relative font-medium flex gap-2 items-center rounded-[5px] pr-[30px] pl-[30px] cursor-pointer bg-[#fff] h-[35px] text-black  mr-[20px] border border-black hover:bg-[#629023] hover:text-white">
                                                    Đăng nhập
                                                </DialogTrigger>
                                                <DialogContent className="w-[400px]">
                                                    <Form {...form}>
                                                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                                                            <DialogHeader>
                                                                <DialogTitle>Đăng nhập</DialogTitle>
                                                                <DialogDescription>
                                                                    Nhập đầy đủ thông tin đăng nhập
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4">
                                                                <div className="grid gap-3">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="email"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Email</FormLabel>
                                                                                <FormControl>
                                                                                    <Input autoComplete="" placeholder="" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="grid gap-3">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="password"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Mật khẩu</FormLabel>
                                                                                <FormControl>
                                                                                    <Input type="password" autoComplete="" placeholder="" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose ref={dialogButton} asChild>
                                                                    <Button onClick={() => {
                                                                        form.reset()
                                                                        form.clearErrors()
                                                                    }}
                                                                        className="cursor-pointer"
                                                                        variant="outline">
                                                                        Hủy bỏ</Button>
                                                                </DialogClose>
                                                                <Button className="cursor-pointer rounted-[5px] bg-[#619d23]" type="submit">Đăng nhập</Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </Form>
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog >
                                                <DialogTrigger className="relative font-medium flex gap-2 items-center rounded-[5px] pr-[30px] pl-[30px] cursor-pointer bg-[#fff] h-[35px] text-black  mr-[20px] border border-black hover:bg-[#629023] hover:text-white">
                                                    Đăng kí
                                                </DialogTrigger>
                                                <DialogContent className="w-[400px]">
                                                    <Form {...regisForm}>
                                                        <form onSubmit={regisForm.handleSubmit(handleRegister)} className="space-y-8">
                                                            <DialogHeader>
                                                                <DialogTitle>Đăng kí tài khoản</DialogTitle>
                                                                <DialogDescription>
                                                                    Nhập đầy đủ thông tin đăng kí
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4">
                                                                <div className="grid gap-3">
                                                                    <FormField
                                                                        control={regisForm.control}
                                                                        name="name"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Họ và tên</FormLabel>
                                                                                <FormControl>
                                                                                    <Input autoComplete="" placeholder="" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="grid gap-3">
                                                                    <FormField
                                                                        control={regisForm.control}
                                                                        name="email"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Email</FormLabel>
                                                                                <FormControl>
                                                                                    <Input autoComplete="" placeholder="" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-4">
                                                                <div className="grid gap-3">
                                                                    <FormField
                                                                        control={regisForm.control}
                                                                        name="password"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Mật khẩu</FormLabel>
                                                                                <FormControl>
                                                                                    <Input type="password" autoComplete="" placeholder="" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="grid gap-3">
                                                                    <FormField
                                                                        control={regisForm.control}
                                                                        name="re_password"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                                                                <FormControl>
                                                                                    <Input type="password" autoComplete="" placeholder="" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose ref={dialogRegisButton} asChild>
                                                                    <Button onClick={() => {
                                                                        regisForm.reset()
                                                                        regisForm.clearErrors()
                                                                    }}
                                                                        className="cursor-pointer"
                                                                        variant="outline">
                                                                        Hủy bỏ</Button>
                                                                </DialogClose>
                                                                <Button
                                                                    className="cursor-pointer rounted-[5px] bg-[#619d23]" type="submit"
                                                                >Đăng kí
                                                                </Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </Form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )
                                }
                                <div className="cart relative">
                                    <Link to={'/checkout'}>
                                        <Button className=" flex gap-2 items-center rounded-[5px] pr-[30px] pl-[30px] cursor-pointer bg-[#629023] min-w-[150px]">
                                            <span>Giỏ hàng</span>
                                            <ShoppingBag />
                                            <span
                                                className="w-[20px] h-[20px] leading-[15px] text-center absolute top-0 right-0 bg-[#fff] rounded-full text-[12px] text-black">
                                                {Number(summary.toltalQuantity)}
                                            </span>
                                        </Button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="header-lower" className="bg-[#F3F4F6] border-b border-[#e2e2e2] py-[15px]">
                    <div className="container">
                        {!isMenuLoading && memoMenu && (
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {memoMenu.map((menu) => (
                                        <NavigationMenuItem key={menu.id}>
                                            <NavigationMenuTrigger className="bg-transparent">
                                                <Link to={write_url(menu.canonical, menu.id, 'menu')}>{menu.name}</Link>
                                            </NavigationMenuTrigger>
                                            {menu.children?.length && menu.children && (
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[200px] gap-4">
                                                        {menu.children.map((sub) => (
                                                            <li>
                                                                <NavigationMenuLink asChild>
                                                                    <Link to={write_url(sub.canonical, sub.id, 'menu')} >{sub.name}</Link>
                                                                </NavigationMenuLink>

                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}




export default Header