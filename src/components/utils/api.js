const token = localStorage.getItem('access_token');

export async function getContratos (url) {
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
    if(resContr.status === 404 || resContr.status === 401) return {status: resContr.status}
    const data = await resContr.json()

    return {status: resContr.status, ...data}
}

export async function getDotacao () {
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
        // .catch((err) => {
        //     setDialogErro({
        //         open: true,
        //         message: `${err.message}`
        //     });
        //     setCarregando(false);
        // })
    return {...data, userMail: inputObject.email}
}

export const newPwRequest = async (formData) => {
    
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

    return await res.json()
}

export async function sendNovoFormData (form) {
    console.log(form)
    const url = new URL(
        `${process.env.REACT_APP_API_URL}/contrato`
    );
    
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };
    
    let body = {
        "departamento_id": form.get("departamento_id"),
        "processo_sei": form.get("processo_sei"),
    };
    
    return await (await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    })).json();
}

export const editaDadosContrato = async (e, dados, formInterno, id) => {
    const url = `${process.env.REACT_APP_API_URL}/contrato/${id}`;
    dados.processo_sei += "/" /* gambiarra para validacao no backend */
    let data = {...dados}
    for(const objArray of formInterno.entries()) {
        data[objArray[0]] = objArray[1]
    }
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