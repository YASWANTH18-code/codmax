const article = document.getElementById("article");
const id = new URLSearchParams(window.location.search).get("id");

async function loadArticle() {
    if (!id) {
        article.innerHTML = '<p class="muted">No story was selected.</p>';
        return;
    }

    try {
        const data = await apiRequest(`/blogs/${encodeURIComponent(id)}`);
        const blog = data.blog;
        document.title = `${blog.title} | BlogSpace`;

        const cover = blog.coverImage
            ? `<img class="article-cover" src="${escapeHTML(blog.coverImage)}" alt="" onerror="this.style.display='none'">`
            : "";

        article.innerHTML = `
          <span class="blog-category">${escapeHTML(blog.category)}</span>
          <h1>${escapeHTML(blog.title)}</h1>
          <p class="article-meta">By ${escapeHTML(blog.author?.name || "Writer")} · ${formatDate(blog.createdAt)}</p>
          ${cover}
          <div class="article-content">${escapeHTML(blog.content)}</div>
        `;
    } catch (error) {
        article.innerHTML = `<p class="muted">${escapeHTML(error.message)}</p>`;
    }
}

loadArticle();
