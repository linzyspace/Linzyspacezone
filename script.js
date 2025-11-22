(async function(){
  const inputBox = document.getElementById('assistantInput');
  const sendBtn = document.getElementById('assistantSend');
  const resultsBox = document.getElementById('assistantResults');

  let posts = [];
  let history = [];

  // ---------------- Utility ----------------
  function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function normalizeText(text) {
    return stripHTML(text).replace(/\s+/g,' ').toLowerCase();
  }

  function getFields(post) {
    return {
      title: post.title || post.name || post.heading || '',
      content: post.content || post.body || post.text || '',
      url: post.url || '#'
    };
  }

  function renderMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type === 'user' ? 'userMessage' : 'assistantMessage'}`;
    div.innerHTML = text;
    resultsBox.appendChild(div);
    resultsBox.scrollTop = resultsBox.scrollHeight;
  }

  function searchPosts(query) {
    query = query.toLowerCase();
    return posts.filter(post => {
      const { title, content } = getFields(post);
      return normalizeText(title).includes(query) || normalizeText(content).includes(query);
    });
  }

  async function fetchJSON(url) {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch(e) {
      console.warn("Fetch error:", e);
      return null;
    }
  }

  // ---------------- Load Render Index ----------------
  const renderUrl = "https://linzyspacezone.onrender.com/search-index.json"; // Must have CORS: *
  const renderPosts = await fetchJSON(renderUrl);
  if(renderPosts) posts = posts.concat(renderPosts);

  // ---------------- Fetch Blogger Posts & Pages ----------------
  async function fetchBlogger(blogId, apiKey) {
    const urls = [
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=50`,
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/pages?key=${apiKey}&maxResults=50`
    ];

    for(const url of urls) {
      const data = await fetchJSON(url);
      if(data && data.items) {
        posts = posts.concat(
          data.items.map(p => ({
            title: p.title,
            content: p.content,
            url: p.url
          }))
        );
      }
    }
  }

  // TODO: Replace with your actual Blogger blog ID and API key
  await fetchBlogger('YOUR_BLOG_ID', 'YOUR_API_KEY');

  // ---------------- Search Handler ----------------
  function handleSearch() {
    const q = inputBox.value.trim();
    if(!q) return;

    history.push({ role: 'user', text: q });
    renderMessage(q, 'user');

    const results = searchPosts(q);
    let response;
    if(results.length) {
      response = results.map(post => {
        const { title, content, url } = getFields(post);
        return `<b><a href="${url}" target="_blank">${title}</a></b><br>${content.substring(0,200)}…`;
      }).join('<hr>');
    } else {
      response = 'No matching posts or pages found.';
    }

    history.push({ role: 'assistant', text: response });
    renderMessage(response, 'assistant');

    inputBox.value = '';
    inputBox.focus();
  }

  sendBtn.addEventListener('click', handleSearch);
  inputBox.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });

})();
