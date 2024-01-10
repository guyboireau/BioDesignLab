import { exec } from "child_process";

const clearMedias = () => {
  exec(
    "wp post delete $(wp post list --post_type=attachment --format=ids) --force",
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`exec error: ${error || stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

const clearPosts = () => {
  exec(
    "wp post delete $(wp post list --format=ids) --force",
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`exec error: ${error || stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

const clearCategories = () => {
  exec(
    "wp term delete category $(wp term list category --field=term_id)",
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`exec error: ${error || stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

const clearTags = () => {
  exec(
    "wp term delete post_tag $(wp term list post_tag --field=term_id)",
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`exec error: ${error || stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

const clearData = () => {
  clearMedias();
  clearPosts();
  clearCategories();
  clearTags();
};

clearData();
