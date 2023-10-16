import { HotTable } from '@handsontable/react'
import Handsontable from 'handsontable';
import { HyperFormula } from 'hyperformula'
import { registerAllModules } from 'handsontable/registry'
import { meses } from '../../../../commom/utils/constants';
import { useExcelTableRef } from '../../../../commom/utils/hooks';
import { buildExcelDataArray } from '../../../../commom/utils/utils';

registerAllModules();

export default function TabelaExecFin({id, execucao, setTabelaRef, mesesExecutados}) {

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
            formulas={{ engine: hyperformulaInstance}}
            rowHeaders={['Notas Empenho', 'Aditamentos', 'Reajustes', 'Empenhado', 'Executado']}
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
                if(row != 4) {return { 
                    readOnly: true,
                    className: "hover:cursor-not-allowed bg-neutral-100 border-1 border-neutral-300"
                }}
                else if(row === 4 && col < execucao.mes_inicial) {return { 
                    readOnly: true, 
                    className: "bg-neutral-100 border-1 border-neutral-300 hover:cursor-not-allowed"
                }} else {return {
                    className: "rounded-none"
                }}

            }}  
            colWidths={100}
            minCols={12}
            height="auto"
            className='htMiddle rounded-xl'
            licenseKey="non-commercial-and-evaluation"
        />
   ) 
}