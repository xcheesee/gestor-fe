import { HotTable } from '@handsontable/react'
import Handsontable from 'handsontable';
import { HyperFormula } from 'hyperformula'
import { registerAllModules } from 'handsontable/registry'
import { meses } from '../../../../commom/utils/constants';
import { useExcelTableRef } from '../../../../commom/utils/hooks';
import { buildExcelDataArray } from '../../../../commom/utils/utils';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../../atomStore';

registerAllModules();

export default function TabelaExecFin({id, execucao, tabelaRef, setTabelaRef, mesesExecutados}) {
    const setSnackbar = useSetAtom(snackbarAtom)

    const ref = useExcelTableRef({
        dadosIniciais: buildExcelDataArray({valorContratado: execucao.contratado, mesesExecutados: mesesExecutados}), 
        execucao: execucao,
        setTabelaRef: setTabelaRef 
    })

    const hyperformulaInstance = HyperFormula.buildEmpty({
        licenseKey: 'internal-use-in-handsontable'
    })

   return (
        <HotTable 
            ref={ref}
            id={id}
            formulas={{ engine: hyperformulaInstance }}
            rowHeaders={['Notas Empenho', 'Aditamentos', 'Reajustes', 'Empenhado', 'Executado', 'Saldo']}
            rowHeaderWidth={120}
            columns={[
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
                {
                    type:'numeric',
                    numericFormat: {
                        culture: 'pt-BR',
                        pattern: 'R$ 0,0.00'
                    }
                },
            ]}  
            afterGetRowHeader={(_, TH) => {
                Handsontable.dom.addClass(TH, "grid content-center bg-paradiso-200 border-1 border-neutral-200")
            }}
            afterGetColHeader={(_, TH) => {
                Handsontable.dom.addClass(TH, "bg-paradiso-200 border-1 border-neutral-200")
            }}
            rowHeights={50}
            colHeaders={meses}
            cells={(row, col, __) => {
                let opts = {}
                if(row < 3 || row > 4) {
                    opts = { 
                        readOnly: true,
                        className: "hover:cursor-not-allowed bg-neutral-100 border-1 border-neutral-300"
                    }
                }
                else if(row === 4 && col < execucao.mes_inicial) {
                    opts = { 
                        readOnly: true, 
                        className: "bg-neutral-100 border-1 border-neutral-300 hover:cursor-not-allowed" 
                    }
                } else {
                    opts = {
                        className: "rounded-none",
                    }
                }
                return opts
            }}  
            colWidths={100}
            minCols={12}
            height="auto"
            beforeChange={(changes, source) => {
                const [[row, col, oldVal, newVal] ] = changes
                const notasEmpenho = tabelaRef.getDataAtCell(0, col)
                const aditamentos = tabelaRef.getDataAtCell(1, col)
                const reajustes = tabelaRef.getDataAtCell(2, col)
                const maxEmpenhado = notasEmpenho + aditamentos + reajustes

                if(row === 3) {
                    if(newVal > maxEmpenhado) {
                        setSnackbar(prev => ({
                            ...prev,
                            open: true,
                            severity: 'error',
                            color: 'error',
                            message: <div>Valor informado ultrapassa o permitido.<br/>(Notas Empenho + Aditamentos + Reajustes)</div>
                        }))
                        return false
                    }
                }
            }}
            className='htMiddle rounded-xl'
            licenseKey="non-commercial-and-evaluation"
        />
   ) 
}