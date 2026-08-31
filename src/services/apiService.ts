async function authenticatedFetch(url: string, token: string, method: string, body?: string) {
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        ...(body !== undefined && { body: body })
    }
    const response = await fetch(url, options)
    return response
}

export default authenticatedFetch