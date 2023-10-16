import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { snackbarAtom } from "../../atomStore"

export const useExcelTableRef = ({dadosIniciais, execucao, setTabelaRef}) => {

    const ref = useCallback( (node) => {
        if (node !== null) {
            setTabelaRef(node.hotInstance)
            node.hotInstance.loadData(dadosIniciais)
        }
    },[execucao])

    return ref
}

export const useErrorSnackbar = () => {
    const setSnackbar = useSetAtom(snackbarAtom)

    const Get = (e) => {
        setSnackbar({
            open: true,
            severity: 'error',
            message: 
                <div>
                    Não foi possível recuperar.
                    <br/>
                    Erro: {e.message}
                    <br/>
                    {e.errors
                        ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                        :<></>
                    }
                </div>,
            color: 'error'
        })
        return
    }

    const Post = (e) => (setSnackbar({
            open: true,
            severity: 'error',
            message: 
                <div>
                    Não foi possível enviar.
                    <br/>
                    Erro: {e.message}
                    <br/>
                    {e.errors
                        ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                        :<></>
                    }
                </div>,
            color: 'error'
        }))


    const Put = (e) => 
        (setSnackbar({
            open: true,
            severity: 'error',
            message: 
                <div>
                    Não foi possível editar.
                    <br/>
                    Erro: {e.message}
                    <br/>
                    {e.errors
                        ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                        :<></>
                    }
                </div>,
            color: 'error'
        }))

    const Delete = (e) => (setSnackbar({
            open: true,
            severity: 'error',
            message: 
                <div>
                    Não foi possível excluir.
                    <br/>
                    Erro: {e.message}
                    <br/>
                    {e.errors
                        ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                        :<></>
                    }
                </div>,
            color: 'error'
        }))
    
    return {Get, Post, Put, Delete}

}