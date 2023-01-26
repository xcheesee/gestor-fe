import { cpf, cnpj } from 'cpf-cnpj-validator';

export function getDateDiff(date1, date2) {
    if(date1 === null || date2 === null) return 0
    const daysBetween = Date.parse(date2) - Date.parse(date1)
    return daysBetween / (1000 * 3600 * 24)
}

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
      return "---"
  }
}

export const formataValores = (valor) => {
  const valores = new Intl.NumberFormat('pt-BR', {
      style: "currency",
      currency: "BRL"
  });

  if (valor === "" || valor === undefined || valor === null || isNaN(valor)) {
      return valores.format(0);
  } else {
      return valores.format(valor);
  }
}