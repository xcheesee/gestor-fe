export function getFormattedFormData(form, initialValue={}) {
    let data = {...initialValue};
    for(const objArray of form.entries()) {
        data[objArray[0]] = objArray[1]
    }
    return data
} 

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        CREATE                                            
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

export async function sendPWData(formSubmit) {
    const formData = new FormData(formSubmit.target);
    const inputObject = Object.fromEntries(formData);
    const url = `${process.env.REACT_APP_API_URL}/login`;
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "email": inputObject.email,
            "password": inputObject.password
        }),
    };
    
    const data = await (await fetch(url, options)).json()
    return {...data, userMail: inputObject.email}
}

export async function sendNovoFormData (form) {
    const token = localStorage.getItem('access_token');
    const url = new URL(
        `${process.env.REACT_APP_API_URL}/contrato`
    );
    
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };
    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(form),
    })
    const json = await res.json()
    return {status: res.status, ...json}
}

export async function postFormData (form, path) {
    const token = localStorage.getItem('access_token');
    let data = getFormattedFormData(form)
    const url = `${process.env.REACT_APP_API_URL}/${path}`;
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    const res = await fetch(url, options)
    const json = await res.json()
    return {status: res.status, ...json}
}

export async function throwablePostForm({form, path,id=""}) {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}/${path}/${id}`;
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: form
    };

    const res = await fetch(url, options)
    const json = await res.json()
    //const json = {}
    if(!res.ok) {
        throw {status: res.status, ...json}
    }
    return {status: res.status, ...json}
}

export async function postAnoExecFin(formData) {
    const url = `${process.env.REACT_APP_API_URL}/exec_financeira_ano`;
    const token = sessionStorage.getItem('access_token');
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: formData
    }

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return res
}

export async function postMesesExecFin({execucao}) {
    const url = `${process.env.REACT_APP_API_URL}/exec_mes`;
    const token = sessionStorage.getItem('access_token');
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(execucao)
    }

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return res
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    READ                                                                                                     
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

export async function checkSeiStatus (processo_sei) {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}/contratos_sei?processo_sei=${processo_sei}`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };
    const res = await fetch(url, options)
    const json = await res.json()

    return {status: res.status, ...json}
}

export async function getContratos (url) {
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    const urlMontado = `${url.url}page=${url.page}${url.filtros}&sort=${url.sort}`;

    const data = await fetch(urlMontado, options)

    if(data.status === 401) {
        localStorage.removeItem('access_token');
        document.location.reload();
    }

    return await data.json()
}

export async function getContrato (numContrato) {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }
    const resContr = await fetch(`${url}/contrato/${numContrato}`, options)
    if(resContr.status === 401) {
        localStorage.removeItem('access_token');
        document.location.reload();
    }
    if(resContr.status === 404) return {status: resContr.status}
    const data = await resContr.json()

    return {status: resContr.status, ...data}
}

export async function getDotacao () {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }
    return await (await fetch(`${url}/dotacao_tipos`, options)).json()
}

export async function getRecursos () {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }
    return await (await fetch(`${url}/origem_recursos`, options)).json()
}

export async function getContrTot (numContrato) {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }
    return fetch(`${url}/contrato_totais/${numContrato}`, options)
}

export async function getFormData (path) {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }
    return await (await fetch(`${url}/${path}`, options)).json()
} 

export async function throwableGetData({path, contratoId=""}) {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}/${path}/${contratoId}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET'
    }
    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return {status: res.status, ...json}
}

export async function getExecucoesFinanceiras(contratoId) {
    const url = `${process.env.REACT_APP_API_URL}/exec_financeira_ano/${contratoId}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw Error('blud')
    }
    return json.data
}

export async function getMesesExecutados(id) {

    const url = `${process.env.REACT_APP_API_URL}/exec_mes/${id}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            //'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw Error("bruh")
    }
    return json.data
}

export async function getCertidoes({numContrato}) {
    const url = `${process.env.REACT_APP_API_URL}/certidoes/${numContrato}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return json
}

export async function getGarantias({numContrato}) {
    const url = `${process.env.REACT_APP_API_URL}/garantias/${numContrato}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return ({status: res.status, ...json})
}

export async function getSubprefeituras({regiao}) {
    const url = `${process.env.REACT_APP_API_URL}/subprefeituras/${regiao}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return json.data
}

export async function getDistritos({subpref}) {
    const url = `${process.env.REACT_APP_API_URL}/distritos/${subpref}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return json.data
}

export async function getContratosVencidos() {
        const url = `${process.env.REACT_APP_API_URL}/contratos_vencimento`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const res = await fetch(url, options)
        const json = await res.json()
        if(res.status === 401) {
            localStorage.removeItem('access_token');
            return {status: res.status, json: json}
        }
        return json?.data
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                                                                                                                 // 
///                                               UPDATE                                                                            //                                             
///                                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const newPwRequest = async (formData) => {
    const token = localStorage.getItem('access_token');
    const url = new URL(
        `${process.env.REACT_APP_API_URL}/alterar_senha`
    );
    
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    const data = {...formData, email: localStorage.getItem('usermail')}

    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    })
    const json = await res.json()

    return {status: res.status, ...json}
}

export const editaDadosContrato = async (e, dados, formInterno, id) => {
    const token = localStorage.getItem('access_token');
    const url = `${process.env.REACT_APP_API_URL}/contrato/${id}`;
    let data = getFormattedFormData(formInterno, dados)
    data.processo_sei += "/" /* gambiarra para validacao no backend */
    const [dia, mes, ano] = data.data_prazo_maximo ? data.data_prazo_maximo.split(/[/]/) : [null, null, null] // formatacao de data para envio ao backend
    data.data_prazo_maximo = ano === undefined || ano === null ? dados.data_prazo_maximo ?? "" :  `${ano}-${mes}-${dia}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    const res = await fetch(url, options)
    const json = await res.json()

    return {status: res.status, ...json}
}

export async function putFormData (id, form, path) {
    const token = localStorage.getItem('access_token');
    let data = getFormattedFormData(form)
    const url = `${process.env.REACT_APP_API_URL}/${path}/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };
    const res = await fetch(url, options)
    const json = await res.json()
    return {status: res.status, ...json}
}

export async function throwablePutForm({id, form, path}) {
    const token = localStorage.getItem('access_token');
    let data = getFormattedFormData(form)
    const url = `${process.env.REACT_APP_API_URL}/${path}/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };
    const res = await fetch(url, options)
    const json = await res.json()

    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return {status: res.status, ...json}

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                                                                                                                 // 
///                                               DELETE                                                                            //                                             
///                                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function throwableDeleteForm({id, path}) {
    const url = `${process.env.REACT_APP_API_URL}/${path}/${id}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    const res = await fetch(url, options)
    const json = await res.json()
    if(!res.ok) {
        throw ({status: res.status, ...json})
    }
    return ({status: res.status, ...json})
}