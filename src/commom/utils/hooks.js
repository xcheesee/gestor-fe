import { useCallback } from "react"

export const useExcelTableRef = ({dadosIniciais, execucao, setTabelaRef}) => {

    const ref = useCallback( (node) => {
        if (node !== null) {
            setTabelaRef(node.hotInstance)
            node.hotInstance.loadData(dadosIniciais)
        }
    },[execucao])

    return ref
}