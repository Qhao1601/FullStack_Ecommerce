import { memo } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface IDeleteConfig<T> {
    item?: T,
    children: React.ReactNode,
    onDelete: (id: number) => void
}

const DeleteConfirmDialog = <T extends { id: number },>({ item, children, onDelete }: IDeleteConfig<T>) => {

    const id = item ? item.id : 0

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn thực hiện chức năng này</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn xóa bản ghi này không , hành động này không thể khôi phục được
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(id)}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default memo(DeleteConfirmDialog)