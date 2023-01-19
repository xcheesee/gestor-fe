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