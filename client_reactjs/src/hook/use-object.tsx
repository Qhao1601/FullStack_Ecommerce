import { baseService } from "@/services/base.Service"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"


interface IUserObject {
    id: string | undefined
    module: string
}

const UseObject = <T,>({ id, module }: IUserObject) => {

    const { data: object, isLoading } = useQuery({
        queryKey: [id, module],
        queryFn: () => baseService.show(module, Number(id))

    })

    const record = useMemo(() => {
        if (object && object.data) {
            return object?.data as T
        }
        return null
    }, [object])


    return {
        object: record,
        isLoading
    }

}
export default UseObject