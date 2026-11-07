const API_BASE = "/api";

function getToken() {
    return localStorage.getItem("blogspace_token");
}

function saveSession(data) {
    localStorage.setItem("blogspace_token", data.token);
    localStorage.setItem("blogspace_user", JSON.stringify(data.user));
}

function clearSession() {
    localStorage.removeItem("blogspace_token");
    localStorage.removeItem("blogspace_user");
}

function getSavedUser() {
    try {
        return JSON.parse(localStorage.getItem("blogspace_user") || "null");
    } catch {
        return null;
    }
}

async function apiRequest(endpoint, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }
    if (getToken()) {
        headers.Authorization = `Bearer ${getToken()}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401 && endpoint !== "/auth/login" && endpoint !== "/auth/register") {
            clearSession();
        }
        throw new Error(data.message || "Request failed. Please try again.");
    }
    return data;
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric"
    });
}

function excerpt(value = "", length = 125) {
    const text = String(value);
    return text.length > length ? text.slice(0, length).trim() + "…" : text;
}
