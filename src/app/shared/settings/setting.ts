export interface Setting {
    key: string,
    options?: any[],
    type: 'checkbox' | 'button' | 'text' | 'select',
    value: any,
    title: string,
    condition?: string,
    change_callback?: (value: any) => void,
}
