#!/usr/bin/node
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

const importMedia = async ({ filename }) => {
  console.log("Importing media ", filename);
  const path = `/var/www/html/medias/${filename}`;
  const { error, stdout, stderr } = await execPromise(
    `wp media import ${path} --porcelain --user=admin| xargs -I {} wp post get {} --field=guid`
  );
  if (error || stderr) {
    throw new Error(`Error importing media ${filename} : ${error || stderr}`);
  }
  console.log(`Created media ${stdout}`);

  return stdout;
};
const formatCategoryOptions = ({ category }) => {
  const descriptionWP = { description: category.description };
  if (category.imageUrl) {
    descriptionWP.image = category.imageUrl.replace(/\n/g, "");
  }
  const options = {
    slug: category.slug,
    parent: category.parent,
    description: JSON.stringify(descriptionWP).replace(/"/g, '\\"'),
  };
  return Object.entries(options)
    .reduce(
      (acc, [key, value]) => (value ? `${acc} --${key}="${value}" ` : acc),
      `"${category.name}" --porcelain`
    )
    .replace(/\n/g, "");
};

const importCategory = async ({ category }) => {
  console.log("Importing category ", category.name);
  if (category.image) {
    category.imageUrl = await importMedia({ filename: category.image });
  }
  const options = formatCategoryOptions({ category });
  const { error, stdout, stderr } = await execPromise(
    `wp term create category ${options}`
  );
  if (error || stderr) {
    console.error(
      `Error importing category ${category.name}: ${error || stderr}`
    );
    return;
  }
  console.log(`Created category ${category.name} with id ${stdout}`);
  if (category.subcategories && stdout) {
    console.log(`Importing subcategories for ${category.name}`);
    await category.subcategories.forEach(async (subcategory, index) => {
      subcategory.name = `${category.name} - ${index}`;
      subcategory.slug = `${category.slug}-${index}`;
      subcategory.parent = stdout;
      await importCategory({ category: subcategory });
    });
  }
};

const importCategories = async () => {
  const categories = JSON.parse(
    fs.readFileSync(path.resolve("./seeds/categories.json"))
  );
  await categories.forEach(
    async (category) => await importCategory({ category })
  );
};

const importTags = async () => {
  const tags = JSON.parse(fs.readFileSync(path.resolve("./seeds/tags.json")));
  await tags.forEach(async (tag) => {
    const { name, slug, description } = tag;
    console.log("Importing tags...", tag.name);
    const { error, stdout, stderr } = await execPromise(
      `wp term create post_tag '${name}' --slug=${slug} --description="${description}"`
    );
    if (error || stderr) {
      console.error(`Error importing tag ${name}: ${error || stderr}`);
      return;
    }
    console.log(stdout);
  });
};

const importPosts = async () => {
  const posts = JSON.parse(fs.readFileSync(path.resolve("./seeds/posts.json")));
  await posts.forEach(async (post) => {
    console.log("Importing post...", post["post_title"]);
    const options = Object.entries(post).reduce((acc, [key, value]) => {
      if (key === "post_content") {
        return `${acc} --${key}=${JSON.stringify(value)}`;
      }
      return `${acc} --${key}=${JSON.stringify(value)}`;
    }, []);
    const { error, stdout, stderr } = await execPromise(
      `wp post create ${options}`
    );
    if (error || stderr) {
      console.error(`Error importing post ${post["post_title"]}: ${error}`);
      return;
    }
    console.log(stdout);
  });
};

const importAll = async () => {
  await importCategories();
  await importTags();
  setTimeout(async () => {
    await importPosts();
  }, 3000);
};

importAll();
