import { atom } from 'jotai'
export const snackbarAtom = atom({
    open:false,
    message: "",
    autoHideDuration: 5000,
    onClose: () => {snackbarAtom.open = false},
    action: <></>,
    severity: ""
})