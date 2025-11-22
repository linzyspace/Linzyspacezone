<script>
let fuse;

fetch("/search-index.json")
  .then(r => r.json())
  .then(posts => {
    fuse = new Fuse(posts, { keys: ["title", "content", "tags"], threshold: 0.3 });
  });

document.getElementById("q").addEventListener("keydown", (e) => {
  if (e.key === "Enter") search(e.target.value);
});

function search(q) {
  const chat = document.getElementById("chat");
  chat.innerHTML = `<b>You:</b> ${q}<br><br>`;

  const results = fuse.search(q).slice(0, 5);

  if (!results.length) {
    chat.innerHTML += "No matches found.";
    return;
  }

  results.forEach(r => {
    chat.innerHTML += `
      <div class="result">
        <a href="${r.item.url}"><b>${r.item.title}</b></a>
        <div class="snippet">${r.item.content.substring(0, 200)}…</div>
      </div>
    `;
  });
}
</script>

