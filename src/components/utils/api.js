export async function getContrato (url) {
    const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
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