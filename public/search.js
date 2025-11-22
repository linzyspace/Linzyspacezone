// Load the search index JSON
async function loadIndex() {
  try {
    const res = await fetch("/search-index.json");
    return await res.json();
  } catch (err) {
    console.error("Failed to load search index:", err);
    return [];
  }
}

// Get query param from URL
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Search posts by title, content, or tags
function searchPosts(query, index) {
  query = query.toLowerCase();
  if (!query) return [];

  return index.filter(post => {
    const title = post.title || "";
    const content = post.content || "";
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    return (
      title.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query) ||
      tags.toLowerCase().includes(query)
    );
  });
}

// Render results as clickable posts
function renderResults(results, outputDiv) {
  if (!results.length) {
    outputDiv.innerHTML = "No matching posts found.";
    return;
  }

  outputDiv.innerHTML = "";
  results.forEach(post => {
    const title = post.title || "";
    const url = post.url || "#";
    const content = post.content ? post.content.substring(0, 200) + "…" : "";
    const div = document.createElement("div");
    div.className = "assistantPost";
    div.innerHTML = `
      <a href="${url}" target="_blank">${title}</a>
      ${content ? `<div>${content}</div>` : ""}
    `;
    outputDiv.appendChild(div);
  });
}

// Main
window.onload = async () => {
  const index = await loadIndex();
  const output = document.getElementById("output");
  const box = document.getElementById("searchBox");
  const go = document.getElementById("goBtn");

  // Auto-run query from URL
  const autoQuery = getQueryParam("ask");
  if (autoQuery) {
    box.value = autoQuery;
    const results = searchPosts(autoQuery, index);
    renderResults(results, output);
  }

  // Search function
  const handleSearch = () => {
    const q = box.value.trim();
    if (!q) return;
    const results = searchPosts(q, index);
    renderResults(results, output);
    box.value = ""; // Clear input
  };

  // Button click
  go.addEventListener("click", handleSearch);

  // Enter key support
  box.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
};
