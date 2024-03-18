//constante utilizada para manter conformidade entre legenda de formulario e feedback em erros

export const contratoLabels = {
    departamento: "Unidade Requisitante",
    departamento_id: "Unidade Requisitante",
    processo_sei: "Processo SEI",
    credor: "Credor",
    cnpj_cpf: "CNPJ/CPF",
    //tipo_objeto: "Tipo de objeto",
    objeto: "Objeto",
    numero_contrato: "Nº Contrato / Nota de Empenho Inicial",
    valor_contrato: "Valor",
    valor_mensal_estimativo: "Valor mensal estimativo",
    condicao_pagamento: "Condição de Pagamento",
    numero_nota_reserva: "Número nota reserva",
    valor_reserva: "Valor reserva",
    categoria: "Categoria",
    subcategoria: "Subcategoria",
    // licitacao_modelo_id: "",
    licitacao_modelo: "Modalidade de licitação",
    estado: "Status do Contrato",
    envio_material_tecnico: "Envio material técnico",
    minuta_edital: "Minuta edital",
    abertura_certame: "Abertura certame",
    homologacao: "Homologação",
    data_assinatura: "Data de assinatura",
    data_inicio_vigencia: "Início da Vigência",
    data_vencimento: "Data de vencimento",
    data_vencimento_aditada: "Data de vencimento (c/Aditamentos)",
    data_prazo_maximo: "Prazo Maximo",
}

export const certidaoLabels = {
    certidoes: "Certidão",
    validade_certidoes: "Validade",
}

export const garantiaLabels = {
    instituicao_financeira: "Instituição financeira",
    numero_documento: "Número do documento",
    valor_garantia: "Valor",
    data_validade_garantia: "Validade",
}

export const fiscLabels = {
    nome_gestor: "Gestor",
    email_gestor: "E-mail do Gestor",
    nome_fiscal: "Fiscal",
    email_fiscal: "E-mail do Fiscal",
    nome_suplente: "Suplente",
    email_suplente: "E-mail do Suplente",
}

export const locaisLabels = {
    regiao: "Região",
    subprefeituras: "Subprefeitura(s)",
    distrito: "Distrito",
    unidade: "Unidade",
}

export const aditValorLabels = {
    tipo_aditamento: "Tipo",
    valor_aditamento: "Valor",
    percentual: "Porcentagem",
    data: "Data de Aditamento"
}

export const aditPrazoLabels = {
    tipo_aditamento: "Tipo",
    dias_reajuste: "Dias Reajuste",
}

export const emprenhoLabels = {
    tipo_empenho: "Tipo de Empenho",
    data_emissao: "Data Emissão",
    numero_nota: "Número da Nota de Empenho",
    valor_empenho: "Valor de Empenho",
    mes_referencia: "Mês de Referência",
    ano_referencia: "Ano de Referência"
}

export const reservaLabels = {
    numero_nota_reserva: "Número da Nota de Reserva",
    data_emissao: "Data de Emissão",
    tipo_nota: "Tipo de Nota",
    valor: "Valor da Reserva"

}

export const liquidacaoLabels = {
    numero_nota_liquidacao: "Número da Nota de Liquidação",
    data_pagamento: "Data de Pagamento",
    valor: "Valor de Pagamento", 
    mes_referencia: "Mês de Referência",
    ano_referencia: "Ano de Referência"
}

export const DevolucaoLabels = {
    numero_devolucao: "Número de Devolução",
    data_devolucao: "Data de Devolução",
    valor: "Valor de Devolução", 
}

export const dotacoesLabels = {
    numero_dotacao: "Número dotação",
}

export const reajusteLabels = {
    valor_reajuste: "Valor",
    indice_reajuste: "Índice de Reajuste",
    data_reajuste: "Data de Reajuste"
}

export const contratoKeys = [
    "departamento_id",
    "processo_sei",
    "credor",
    "cnpj_cpf",
    "tipo_objeto",
    "objeto",
    "numero_contrato",
    "data_assinatura",
    "valor_contratado",
    "valor_mensal_estimativo",
    "data_inicio_vigencia",
    "data_vencimento",
    "condicao_pagamento",
    "data_prazo_maximo",
    "numero_nota_reserva",
    "valor_reserva",
    "empresa_id"
]

export const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

export const tipos_notas_reserva = { 
        nova: 'Nova Reserva',
        correcao: "Correção",
        cancelamento: "Cancelamento",
        renovacao: "Renovação",
    }

export const totalizadoresLabels = {
    totalResevado: "Total Reservado",
    totalEmpenhado: "Total Empenhado",
    realizado: "Realizado",
    totalDevolucoes: "Devolucoes",
    saldo: "Saldo",
    mediaAnualEmpenho: "Média Mensal Empenhado",
    mediaAnualRealizado: "Média Mensal Realizado"
}