const blogForm = document.getElementById("blogForm");
const message = document.getElementById("formMessage");
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

if (!getToken()) {
    window.location.replace("login.html");
}

function setMessage(text, success = false) {
    message.textContent = text;
    message.classList.toggle("success", success);
}

async function prepareEditor() {
    if (!editId) return;

    document.getElementById("editorTitle").textContent = "Edit your blog";
    document.getElementById("submitBlog").textContent = "Save changes";

    try {
        const data = await apiRequest(`/blogs/${encodeURIComponent(editId)}`);
        const blog = data.blog;
        const user = getSavedUser();

        // The API update route enforces ownership; this check improves the UI experience.
        if (user && blog.author?._id !== user.id && blog.author?._id !== user._id) {
            throw new Error("You can edit only your own blog posts.");
        }

        document.getElementById("title").value = blog.title;
        document.getElementById("category").value = blog.category;
        document.getElementById("coverImage").value = blog.coverImage || "";
        document.getElementById("content").value = blog.content;
    } catch (error) {
        setMessage(error.message);
        blogForm.querySelector("button[type='submit']").disabled = true;
    }
}

blogForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = document.getElementById("submitBlog");
    button.disabled = true;
    setMessage(editId ? "Saving changes..." : "Publishing your blog...");

    const payload = {
        title: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value,
        coverImage: document.getElementById("coverImage").value.trim(),
        content: document.getElementById("content").value.trim()
    };

    try {
        const data = await apiRequest(editId ? `/blogs/${encodeURIComponent(editId)}` : "/blogs", {
            method: editId ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        setMessage(data.message, true);
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);
    } catch (error) {
        setMessage(error.message);
    } finally {
        button.disabled = false;
    }
});

prepareEditor();
