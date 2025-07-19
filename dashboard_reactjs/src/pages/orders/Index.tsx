
import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import FilterCommon from "@/components/filter-common"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

import { isApiSuccessResponse } from "@/interfaces/api.response"
import { commonExtraFilter, IFilterSelectConfig } from "@/config/constans"
import PaginateComponent from "@/components/pagination"
import { IColumn } from "@/interfaces/layout.interface"
import CustomTable from "@/components/custom-table"
import { usePage } from "@/hooks/usePage"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"
import { IOrder } from "@/interfaces/orders/order.interface"
import { AppOrderItem } from "@/components/app-order-item"



export interface IConfigModule<T> {
    endpoint: string,
    title: string,
    description: string,
    createLink: string,
    extraFilters: IFilterSelectConfig[],
    columns: IColumn[],
    fields: (keyof T)[],
}

const config: IConfigModule<IOrder> = {
    endpoint: 'v1/orders',
    title: 'Quản lý quyền',
    description: 'Quản lý thông tin danh sách quyền',
    createLink: '/orders/create',
    extraFilters: [...commonExtraFilter],
    columns: [
        { key: 'checkbox', label: '', className: '' },
        { key: 'code', label: 'Mã đơn hàng', className: '' },
        { key: 'fullname', label: 'Tên đơn hàng', className: '' },
        { key: 'phone', label: 'SĐt', className: '' },
        { key: 'address', label: 'Địa chỉ', className: '' },
        { key: 'totalDiscount', label: 'Khuyến mãi', className: '' },
        { key: 'totalAmount', label: 'Tổng tiền', className: '' },
        { key: 'totalQuantity', label: 'Tổng sl', className: '' },
        { key: 'status', label: 'Thanh toán', className: '' },
        { key: 'payment_method', label: 'Hình thức', className: '' },
        { key: 'actions', label: 'Thao tác', className: '' },
    ],
    fields: []

}

const TableRowComponent = React.memo(({
    item,
    handleDelete
}: {
    item: IOrder,
    handleDelete: (id: number) => void
}) => (
    <TableRow key={item.id} className="hover:bg-gray-50">
        <TableCell className="text-center">
            <Input type="checkbox" className="size-4" />
        </TableCell>
        <TableCell className="text-left cursor-pointer text-blue-500">
            {/* xem chi tiết đơn hàng */}
            <AppOrderItem order={item} >
                {item.code}
            </AppOrderItem>
        </TableCell>
        <TableCell className="text-left">{item.fullname}</TableCell>
        <TableCell className="text-center">{item.phone}</TableCell>
        <TableCell className="text-center">{item.address}</TableCell>
        <TableCell className="text-center">{item.totalDiscount}</TableCell>
        <TableCell className="text-center">{item.totalAmount}</TableCell>
        <TableCell className="text-center">{item.totalQuantity}</TableCell>
        <TableCell className="text-center">{item.status}</TableCell>
        <TableCell className="text-center">{item.paymentMethod}</TableCell>
        <TableCell>
            <div className="flex items-center justify-center gap-2">
                <Link to={`/orders/edit/${item.id}`}>
                    <Button className="size-10 bg-[#0088FF] rounded-[5px] p-2 hover:opacity-90">
                        <Edit className="w-4 h-4" />
                    </Button>
                </Link>
                <DeleteConfirmDialog item={item} onDelete={() => handleDelete(item.id)}>
                    <Button className="size-10 bg-[#ed5565] rounded-[5px] p-2 hover:opacity-90">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </DeleteConfirmDialog>

            </div>
        </TableCell>
    </TableRow>
))


const OrdersIndex = () => {
    const {
        title,
        description,
        createLink,
        columns,
        memoziedFilterCommonProps,
        isLoading,
        tableItems,
        records: permissions,
        handlePageChange,
        handleDelete,
    } = usePage({ config })

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                <Card className="rounded-[5px]">
                    <CardHeader className="border-b">
                        <CardTitle> {title} </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-[20px]">
                            <FilterCommon
                                {...memoziedFilterCommonProps}
                            />
                            <Link to={createLink} className="ml-[-15px]">
                                <Button className="bg-[#ed5565] shadown rounded-[4px] cursor-pointer">
                                    <PlusCircle />
                                    Thêm mới bản ghi
                                </Button>
                            </Link>
                        </div>
                        {/* custom Table render ra dòng cột truyền vào 3 tham số  */}
                        <CustomTable
                            columns={columns}
                            data={tableItems}
                            render={(item: IOrder) => (
                                <TableRowComponent
                                    key={item.id}
                                    item={item}
                                    handleDelete={handleDelete}
                                />
                            )}
                        />
                    </CardContent>
                    <CardFooter className="borderr-t">
                        {!isLoading && permissions && 'data' in permissions && isApiSuccessResponse(permissions) && 'links' in permissions.data && (
                            <PaginateComponent
                                links={permissions.data.links}
                                // click chuyển trang
                                onPageChange={handlePageChange}
                                from={permissions.data.from}
                                to={permissions.data.to}
                                total={permissions.data.total}
                                currentPage={permissions.data.current_page}
                            />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default OrdersIndex