// Universal API Base URL Resolver for Vercel, GitHub Pages, and Live Preview
(function () {
    const LIVE_BACKEND_URL = "https://ais-pre-fpmyatwn3fjuwgoewqwrrh-71101538388.asia-southeast1.run.app";

    function getApiUrl(endpoint) {
        if (!endpoint) return "";
        if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) return endpoint;

        const cleanEndpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;

        // If running on GitHub Pages or custom static host, direct API requests to the live backend
        if (
            window.location.hostname.includes("github.io") ||
            window.location.protocol === "file:"
        ) {
            return LIVE_BACKEND_URL + cleanEndpoint;
        }

        // On Vercel, relative paths /api/* are seamlessly routed via vercel.json proxy
        return cleanEndpoint;
    }

    window.getApiUrl = getApiUrl;
    window.LIVE_BACKEND_URL = LIVE_BACKEND_URL;
})();
