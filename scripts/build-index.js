import fs from "fs/promises";
import glob from "fast-glob";
import matter from "gray-matter";
import { marked } from "marked";

async function build() {
  const files = await glob(["posts/*.md"]);

  const posts = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);

    const plain = marked.parse(content).replace(/<[^>]+>/g, " ");

    posts.push({
      title: data.title || file.replace("posts/", "").replace(".md", ""),
      url: `/posts/${file.replace("posts/", "").replace(".md", "")}`,
      tags: data.tags || [],
      content: plain.slice(0, 8000)
    });
  }

  await fs.writeFile("public/search-index.json", JSON.stringify(posts, null, 2));
  console.log("✔ search-index.json generated");
}

build();
