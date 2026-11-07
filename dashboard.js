const dashboardBlogs = document.getElementById("dashboardBlogs");
const dashboardMessage = document.getElementById("dashboardMessage");

async function loadDashboard() {
    if (!getToken()) {
        window.location.replace("login.html");
        return;
    }

    try {
        const [meData, blogData] = await Promise.all([
            apiRequest("/auth/me"),
            apiRequest("/blogs/mine")
        ]);

        document.getElementById("userName").textContent = meData.user.name;
        document.getElementById("userEmail").textContent = meData.user.email;
        document.getElementById("blogCount").textContent = blogData.blogs.length;

        if (!blogData.blogs.length) {
            dashboardBlogs.innerHTML = '<div class="empty-state"><p class="muted">You have not published any stories yet.</p><a class="primary-btn" href="create-blog.html">Write your first blog</a></div>';
            return;
        }

        dashboardBlogs.innerHTML = blogData.blogs.map(blog => `
          <article class="dashboard-item">
            <div>
              <h3>${escapeHTML(blog.title)}</h3>
              <p>${escapeHTML(blog.category)} · Updated ${formatDate(blog.updatedAt)}</p>
            </div>
            <div class="item-actions">
              <a class="small-btn" href="blog.html?id=${encodeURIComponent(blog._id)}">View</a>
              <a class="small-btn" href="create-blog.html?id=${encodeURIComponent(blog._id)}">Edit</a>
              <button class="small-btn danger" data-delete="${escapeHTML(blog._id)}">Delete</button>
            </div>
          </article>
        `).join("");
    } catch (error) {
        dashboardMessage.textContent = error.message;
        if (!getToken()) window.location.replace("login.html");
    }
}

dashboardBlogs.addEventListener("click", async event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;

    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
        await apiRequest(`/blogs/${button.dataset.delete}`, { method: "DELETE" });
        dashboardMessage.textContent = "Blog deleted successfully.";
        dashboardMessage.classList.add("success");
        await loadDashboard();
    } catch (error) {
        dashboardMessage.textContent = error.message;
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    clearSession();
    window.location.href = "/";
});

loadDashboard();
