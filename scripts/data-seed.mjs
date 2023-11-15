#!/usr/bin/node
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const importCategories = () => {
  const categories = JSON.parse(
    fs.readFileSync(path.resolve("./seeds/categories.json"))
  );
  categories.forEach((category) => {
    const { name, slug, description } = category;
    console.log("Importing category...", name);
    exec(
      `make wp term create category ${name} OPTIONS='--slug=${slug} --description="${description}"'`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  });
};

const importTags = () => {
  const tags = JSON.parse(fs.readFileSync(path.resolve("./seeds/tags.json")));
  tags.forEach((tag) => {
    const { name, slug, description } = tag;
    console.log("Importing tags...", tag.name);
    exec(
      `make wp term create post_tag ${name} OPTIONS='--slug=${slug} --description="${description}"'`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  });
};

const importPosts = () => {
  console.log(
    "Waiting 3 seconds for categories and tags to be created, then importing posts..."
  );
  setTimeout(() => {
    const posts = JSON.parse(
      fs.readFileSync(path.resolve("./seeds/posts.json"))
    );
    posts.forEach((post) => {
      console.log("Importing post...", post["post_title"]);
      const options = Object.entries(post).reduce((acc, [key, value]) => {
        if (key === "post_content") {
          return `${acc} --${key}=${JSON.stringify(value)}`;
        }
        return `${acc} --${key}=${JSON.stringify(value)}`;
      }, []);

      exec(
        `make wp post create OPTIONS='${options}'`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        }
      );
    });
  }, 3000);
};

const importAll = () => {
  importCategories();
  importTags();
  importPosts();
};

importAll();
