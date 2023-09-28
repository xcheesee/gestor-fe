import { useCallback, useState } from "react"

export const useExcelTableRef = ({dadosIniciais, execucao}) => {
    const [hot, setHot] = useState()
    const ref = useCallback( (node) => {
        if (node !== null) {
            setHot(node.hotInstance)
            node.hotInstance.loadData(dadosIniciais)
        }
    },[execucao])
    return [hot, ref]
}