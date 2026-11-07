const blogGrid = document.getElementById("blogGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const homeMessage = document.getElementById("homeMessage");

async function loadBlogs() {
    try {
        const params = new URLSearchParams();
        if (categoryFilter.value !== "All") params.set("category", categoryFilter.value);
        if (searchInput.value.trim()) params.set("search", searchInput.value.trim());

        const data = await apiRequest(`/blogs?${params.toString()}`);
        if (!data.blogs.length) {
            blogGrid.innerHTML = '<p class="muted">No stories found. Be the first to publish one!</p>';
            return;
        }

        blogGrid.innerHTML = data.blogs.map(blog => {
            const cover = blog.coverImage
                ? `<img class="blog-cover" src="${escapeHTML(blog.coverImage)}" alt="" onerror="this.style.display='none'">`
                : `<div class="blog-cover"></div>`;
            return `
              <article class="blog-card">
                <a class="card-link" href="blog.html?id=${encodeURIComponent(blog._id)}">
                  ${cover}
                  <div class="blog-info">
                    <span class="blog-category">${escapeHTML(blog.category)}</span>
                    <h3>${escapeHTML(blog.title)}</h3>
                    <p>${escapeHTML(excerpt(blog.content))}</p>
                    <div class="blog-meta"><span>By ${escapeHTML(blog.author?.name || "Writer")}</span><span>${formatDate(blog.createdAt)}</span></div>
                  </div>
                </a>
              </article>`;
        }).join("");
    } catch (error) {
        blogGrid.innerHTML = '<p class="muted">Could not load stories. Please check that the server and database are running.</p>';
        homeMessage.textContent = error.message;
    }
}

categoryFilter.addEventListener("change", loadBlogs);
let searchTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadBlogs, 300);
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));

const navButtons = document.getElementById("navButtons");
if (getToken() && navButtons) {
    navButtons.innerHTML = '<a href="dashboard.html" class="primary-btn">My Dashboard</a>';
}

loadBlogs();
