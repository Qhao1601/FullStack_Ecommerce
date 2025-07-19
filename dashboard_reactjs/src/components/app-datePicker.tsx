import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


export interface DatePickerProps {
    onDataChange: (date: string) => void
    label?: string,
    className?: string,
    formatDate?: string
    disable?: boolean,
    value?: string,
    isUpdateModel?: boolean
}

const DatePicker = ({ onDataChange, label, className, formatDate = 'd/m/Y', disable, value, isUpdateModel }: DatePickerProps) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const isUpdateInit = React.useRef<boolean>(false)
    const lastValueRef = React.useRef<string>('')


    const parseStringDate = (dateString: string, format: string): Date | undefined => {
        if (!dateString || !format) return undefined
        try {
            if (format === 'd-m-Y' && dateString.includes('-')) {
                const parts = dateString.split('-')
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10)
                    const month = parseInt(parts[1], 10) - 1
                    const year = parseInt(parts[2], 10)
                    const partseDate = new Date(year, month, day)
                    if (!isNaN(partseDate.getTime())) {
                        return partseDate
                    }
                }
            }
        } catch (error) {
            console.error('Error', dateString, error)
            return undefined
        }
    }

    React.useEffect(() => {
        if (date) {
            const dateFormat = formatingDate(date, formatDate)
            onDataChange(dateFormat)
        }
    }, [date])

    React.useEffect(() => {
        if (!value || !isUpdateModel) return
        const parseDate = parseStringDate(value, 'd-m-Y')
        if (parseDate !== undefined) {
            setDate(parseDate)
        }
    }, [value, formatDate, isUpdateModel]
    )

    React.useEffect(() => {
        if (!isUpdateModel) {
            isUpdateInit.current = false;
            lastValueRef.current = '';
        }
    }, [isUpdateModel])


    // format lại ngày tháng năm theo định dạng d/m/Y
    const formatingDate = (date: Date, format: string) => {
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear().toString()

        return format.replace('d', day).replace('m', month).replace('Y', year)
    }


    return (
        <div className={`flex flex-col gap-3 ${className ? className : ""}`}>
            <Label className="px-1">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                        disabled={disable}>
                        {date ? formatingDate(date, formatDate) : "Chọn ngày"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )

}


export default DatePicker