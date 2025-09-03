export async function getSecretHash(clientId, clientSecret, username) {
    
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(clientSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode(username + clientId)
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}