async function loadIndex() {
  const res = await fetch("/search-index.json");
  return await res.json();
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function searchPosts(query, index) {
  query = query.toLowerCase();
  let results = [];

  for (const post of index) {
    if (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    ) {
      results.push(post);
    }
  }

  return results;
}

window.onload = async () => {
  const index = await loadIndex();
  const output = document.getElementById("output");
  const box = document.getElementById("searchBox");
  const go = document.getElementById("goBtn");

  // auto-run query if ?ask=something is passed
  const autoQuery = getQueryParam("ask");
  if (autoQuery) {
    box.value = autoQuery;
    const results = searchPosts(autoQuery, index);
    output.innerHTML = JSON.stringify(results, null, 2);
  }

  go.onclick = () => {
    const q = box.value.trim();
    const results = searchPosts(q, index);
    output.innerHTML = JSON.stringify(results, null, 2);
  };
};
