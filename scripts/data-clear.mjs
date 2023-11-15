import { exec } from "child_process";

const clearPostData = () => {
  exec(
    "make wp post delete $(make wp post list OPTIONS='--format=ids')",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
  exec(
    "make wp term delete category $(make wp term list category OPTIONS='--field=term_id')",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
  exec(
    "make wp term delete post_tag $(make wp term list post_tag OPTIONS='--field=term_id')",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
};

clearPostData();
