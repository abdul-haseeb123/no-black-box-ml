import { draw } from "../common/draw.js";
import { createCanvas } from "jsr:@gfx/canvas";
import constants from "../common/constants.js";
import utils from "../common/utils.js";
import fs from "node:fs/promises";

const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

// const files = Deno.readDir(constants.RAW_DIR);
const files = await fs.readdir(constants.RAW_DIR);
const samples = [];
let id = 1;
const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

for await (const file of files) {
  const byteArray = await Deno.readFile(constants.RAW_DIR + "/" + file);
  const content = decoder.decode(byteArray);
  const { session, student, drawings } = JSON.parse(content);
  for (const label in drawings) {
    samples.push({
      id,
      label,
      student_name: student,
      student_id: session,
    });
    const paths = drawings[label];
    const drawing_data = encoder.encode(JSON.stringify(paths));
    await Deno.writeFile(constants.JSON_DIR + "/" + id + ".json", drawing_data);
    await generateImageData(constants.IMG_DIR + "/" + id + ".png", paths);
    utils.printProgress(id, files.length * 8);
    id++;
  }
}

const data = encoder.encode(JSON.stringify(samples));

await Deno.writeFile(constants.SAMPLES, data);

async function generateImageData<T>(outFile: string | URL, paths: T) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);
  const buffer = canvas.encode("png");
  await Deno.writeFile(outFile, buffer);
}
