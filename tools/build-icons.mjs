import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
mkdirSync("public/icons", { recursive: true });
const svg = readFileSync("public/icon.svg", "utf8");
for (const size of [192, 512])
  writeFileSync(
    `public/icons/icon-${size}.png`,
    new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng(),
  );
