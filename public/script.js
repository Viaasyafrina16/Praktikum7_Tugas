// ----- USER -----
// Generate user + API Key dari halaman user biasa
async function generateUserApiKey() {
    const firstname = document.getElementById("firstname")?.value;
    const lastname = document.getElementById("lastname")?.value;
    const email = document.getElementById("email")?.value;
    const status = document.getElementById("status");

    if (!firstname || !lastname || !email) {
        status.innerText = "⚠ Semua field wajib diisi!";
        status.style.color = "red";
        return;
    }

    status.innerText = "⏳ Mengirim...";

    try {
        const res = await fetch("/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, lastname, email })
        });
        const data = await res.json();

        if (data.success) {
            status.style.color = "green";
            status.innerHTML = `✅ API Key: <b>${data.data.apiKey}</b>`;
            document.getElementById("firstname").value = "";
            document.getElementById("lastname").value = "";
            document.getElementById("email").value = "";
        } else {
            status.style.color = "red";
            status.innerText = data.message;
        }
    } catch (err) {
        status.style.color = "red";
        status.innerText = "❌ Error saat request!";
    }
}

// ----- ADMIN LOGIN / REGISTER -----
async function login() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const status = document.getElementById("status");

    const res = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "admin.html";
    } else {
        status.innerText = data.message;
        status.style.color = "red";
    }
}

async function register() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const status = document.getElementById("status");

    const res = await fetch("/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    status.innerText = data.message;
    status.style.color = data.success ? "green" : "red";
}

// ----- DASHBOARD ADMIN -----
// Load semua users
async function loadUsers() {
    const tbody = document.getElementById("usersBody");
    const token = localStorage.getItem("token");
    const res = await fetch("/admin/users", {
        headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();

    tbody.innerHTML = "";

    if (data.success && data.data.length > 0) {
        data.data.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.firstname}</td>
                    <td>${u.lastname}</td>
                    <td>${u.email}</td>
                    <td><button class="btn-delete" onclick="deleteUser(${u.id})">Hapus</button></td>
                </tr>`;
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="4" class="no-data">Belum ada user</td></tr>`;
    }
}

// Load semua API Keys
async function loadApiKeys() {
    const tbody = document.getElementById("apiKeysBody");
    const token = localStorage.getItem("token");
    const res = await fetch("/admin/apikeys", {
        headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();

    tbody.innerHTML = "";

    if (data.success && data.data.length > 0) {
        data.data.forEach(k => {
            tbody.innerHTML += `
                <tr>
                    <td>${k.api_key}</td>
                    <td>${k.status}</td>
                    <td>${k.used}</td>
                    <td><button class="btn-delete" onclick="deleteApiKey(${k.id})">Hapus</button></td>
                </tr>`;
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="4" class="no-data">Belum ada API key</td></tr>`;
    }
}

// Hapus user
async function deleteUser(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    const res = await fetch(`/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    alert(data.message);
    loadUsers();
    loadApiKeys();
}

// Hapus API Key
async function deleteApiKey(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Yakin ingin menghapus API Key ini?")) return;

    const res = await fetch(`/admin/apikeys/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    alert(data.message);
    loadApiKeys();
}

// Generate API Key baru (untuk admin)
async function generateApiKey() {
    const token = localStorage.getItem("token");
    const res = await fetch("/admin/apikeys", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    if (data.success) alert("API Key baru berhasil dibuat: " + data.data.apiKey);
    loadApiKeys();
}

// Jika halaman dashboard, load data otomatis
if (document.getElementById("usersBody")) {
    loadUsers();
    loadApiKeys();
}
