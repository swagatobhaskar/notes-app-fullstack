// import { useRouter } from "next/navigation"

export async function apiFetch<T = any>(
    input: RequestInfo,
    init: RequestInit = {},
    retry = true
): Promise<T> {
    const config: RequestInit = {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {}),
        },
    }

    // const router = useRouter()

    const res = await fetch(input, config)

    if (res.status === 401 && retry) {
        console.log("RETRY AFTER 401")
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (refreshRes.ok) {
            return await apiFetch<T>(input, init, false)
        } else {
            throw new Error('Session expired. Please login again!')
            // router.push('/login')
        }
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.detail || 'Request Failed')
    }

    return res.json() as Promise<T>
}

// GET
export const apiGet = <T = any>(url: string, init: RequestInit = {}) => apiFetch<T>(url, { ...init, method: 'GET' })

// POST
export const apiPost = <T= any>(url: string, body: any, init: RequestInit = {}) => 
    apiFetch<T>(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(body),
    })

// PATCH
export const apiPatch = <T= any>(url: string, body: any, init: RequestInit = {}) => 
    apiFetch<T>(url, {
        ...init,
        method: 'PATCH',
        body: JSON.stringify(body),
    })

// DELETE
export const apiDelete = <T = any>(url: string, init: RequestInit = {}) => 
    apiFetch<T>(url, { ...init, method: 'DELETE' })
