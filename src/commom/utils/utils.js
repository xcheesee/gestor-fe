import { Box, Typography } from '@mui/material';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';
//import { meses } from './constants';

// export function getDateDiff(date1, date2) {
//     if(date1 === null || date2 === null) return 0
//     const daysBetween = Date.parse(date2) - Date.parse(date1)
//     return daysBetween / (1000 * 3600 * 24)
// }

export const mascaraProcessoSei = (processoSei) => {
    if (processoSei !== null && processoSei !== "" && processoSei !== undefined) {
      return processoSei.replace(/([\d]{4})([\d]{4})([\d]{7})([\d]{1})/gm, '$1.$2/$3-$4');
    } else {
      return "";
    }
  }

export const mascaraContrato = (contrato) => {
    if (contrato !== null && contrato !== "" && contrato !== undefined) {
      return contrato.replace(/([\d]{3})([\w]{4})(\d{4})/gm, '$1/$2/$3');
    } else {
      return "";
    }
  }

export function mascaraDevolucao(numDevolucao) {
  if (numDevolucao !== null && numDevolucao !== "" && numDevolucao !== undefined) {
    return `${numDevolucao}`.replace(/([\d]{2})([\d]{4})/gm, '$1.$2')
  }
  return "---"
}

export const irParaTopo = () => window.scrollTo(0, 0);

export const formataCpfCnpj = (cpfCnpj) => {
  if (cpfCnpj === "" || cpfCnpj === undefined || cpfCnpj === null) {
      return "";
  } else {
      return cpfCnpj?.length > 11 ? cnpj.format(cpfCnpj) : cpf.format(cpfCnpj);
  }
}

export const primeiraLetraMaiuscula = (string) => {
  if (typeof string === "string") {
      return string[0].toUpperCase() + string.substring(1);
  } else {
      return "---";
  }
}

export const formataData = (data) => {
  if (data !== undefined && data !== null) {
      let dArr = data.split("-");
      let dia = dArr[2];
      let mes = dArr[1];
      let ano = dArr[0];

      if (data === "") {
          return "";
      } else {
          return `${dia}/${mes}/${ano}`;
      };
  } else {
      return "- - -"
  }
}

export const formataValores = (valor) => {
  const valores = new Intl.NumberFormat('pt-BR', {
      style: "currency",
      currency: "BRL"
  });

  if(valor === "" || valor === undefined || valor === null) {
    return valores.format(0);
  }
  else if (isNaN(valor)) {
    let formatado = valor.replace(/\./g, "")
    formatado = formatado.replace(/,/g, ".")
    return valores.format(formatado);
  }
  return valores.format(valor);
}

export function brlToFloat(num) {
  const formatted = num.replace(/[^\d.,]+/g,"")
  return formatted
}

export function saveLocalStorageInput(numeroContrato, campo, valor) {
  return localStorage.setItem(`contrato-${numeroContrato}-${campo}`, valor)
}

export function getLocalStorageInput(numeroContrato, campo) {
  return localStorage.getItem(`contrato-${numeroContrato}-${campo}`)
}

export function calculaSaldo(dadosExecucao) {
  if(!dadosExecucao) return []
  const { empenhos, aditamentos, reajustes, executado, reservado} = dadosExecucao
  const saldo = new Array(12) 
  for(let i = 0; i < 12; i++) {
    if(i === 0) {
      saldo[i] = +empenhos[i] + +aditamentos[i] + +reajustes[i] + +reservado[i] - +executado[i]
    } else {
      saldo[i] = +saldo[i-1] + +empenhos[i] + +aditamentos[i] + +reajustes[i] + +reservado[i] - +executado[i]
    }
  }
  return saldo
}

// export function RetornaCampoValor ({campos, valores}) {
//   return (
//       <Box sx={{ margin: '0 1rem' }}>
//           {campos.map((campo, index) => {
//               return (
//                   <Typography sx={{ margin: '1rem 0' }} key={index} component="pre">
//                       <strong>{campo}</strong>
//                       <Typography sx={{ margin: '0.5rem' }}>
//                           {valores[index] === "" || valores[index] === null ? "---" : valores[index]}
//                       </Typography>
//                   </Typography>
//               );
//           })}
//       </Box>
//   );
// }

export function TabValues ({ entry, labels, label}) {
  return(
    <Box className="flex flex-col gap-8 lg:px-4">
        {Object.entries(entry)
            ?.filter((keyVal) => !(keyVal[0] === "id" || keyVal[0] === "contrato_id"))
            ?.map((keyVal, index) => 
            (
                <Box className="" key={`tab-${label}-${index}`}>
                    <Typography className="pb-2">{labels[keyVal[0]]}</Typography>
                    <Box className="ml-4 font-bold text-base">{keyVal[1] || "- - -"}</Box>
                </Box>
        ))}
    </Box>
  )
}

 export const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value,
              name: values.name
            },
          });
        }}
        //isNumericString
        thousandSeparator="."
        decimalSeparator=","
        fixedDecimalScale
        decimalScale={2}
      />
    );
});

export function buildExcelDataArray(options={}) {
  let {dadosExecucao, execucao} = options
  let data = [];

  const executados = new Array(12).fill("")
  const empenhados = new Array(12).fill("")

  dadosExecucao?.exec?.forEach((val => {
    executados[val.mes - 1] = !!val.execucao ? val.execucao : ""
    empenhados[val.mes - 1] = !!val.empenhado ? val.empenhado : ""
  }))


  function firstColSaldoFunc(colVal) {
    const currColLetter = String.fromCharCode(colVal+65)
    //transforma numero de coluna em notacao de excel
    //ex apos formatacao: =A4-A5+0 
    const isMesInicial = colVal === parseInt(execucao.mes_inicial) - 1 
    const isBeforeMesInicial = colVal === parseInt(execucao.mes_inicial) - 2
    if(isMesInicial && empenhados[0] == "") {
      empenhados[0] = execucao.contratado
    }

    return `=${currColLetter}4-${currColLetter}5+${isBeforeMesInicial ? (parseInt(execucao.contratado) || 0) : 0}`
  }

  function saldoFunc(colVal) {
    const currColLetter = String.fromCharCode(colVal+65)
    //const prevColLetter = String.fromCharCode(colVal+64)
    //const isMesInicial = colVal === parseInt(execucao.mes_inicial) - 1
    const isBeforeMesInicial = colVal === parseInt(execucao.mes_inicial) - 2
    //transforma numero de coluna em notacao de excel
    //ex apos formatacao: =A6+B4-B5+0 
    return `=${currColLetter}4-${currColLetter}5+${isBeforeMesInicial ? (parseInt(execucao.contratado) || 0) : 0}`
  }

  data.push(dadosExecucao.notasEmpenho)
  data.push(dadosExecucao.aditamentos)
  data.push(dadosExecucao.reajustes)
  data.push(empenhados)
  data.push(executados)
  data.push( [...Array(12)].map((v, ind) => {
    if(ind === 0) {
      return firstColSaldoFunc(ind)
    } else{
      return saldoFunc(ind)
    }}))
  return data
}