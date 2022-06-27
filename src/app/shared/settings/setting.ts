export interface Setting {
    key: string,
    value: any,
    title: string,
    condition?: string,
    change_callback?: (value: any) => void,
}
