import { useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { snackbarAtom } from "../../atomStore"

//export const useExcelTableRef = ({dadosIniciais, setTabelaRef}) => {
//
//    const ref = useCallback( (node) => {
//        if (node !== null) {
//            setTabelaRef(node.hotInstance)
//            node.hotInstance.loadData(dadosIniciais)
//        }
//    },[])
//
//    return ref
//}

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
                        &&Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                    }
                </div>,
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
                        && Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                    }
                </div>,
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
                        &&Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                    }
                </div>,
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
                        &&Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                    }
                </div>,
        }))
    
    return {Get, Post, Put, Delete}

}

export function useInitialRender () {
    const initialRenderRef = useRef(true) 
    useEffect(() => {
        if(initialRenderRef.current) {
            initialRenderRef.current = false
        }
    })

    return initialRenderRef.current
}