export function isSameOriginRequest(request: Request, url: URL, site?: URL): boolean {
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite !== null && fetchSite !== "same-origin") return false;

    const origin = request.headers.get("origin");
    // TLS can terminate at the reverse proxy. Match the configured HTTPS origin only for its own host.
    return origin === url.origin || (site?.protocol === "https:" && url.host === site.host && origin === site.origin);
}
