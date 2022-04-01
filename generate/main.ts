import { promises as fsp } from "fs";
import Converter, { LuaHelpDocumentModes } from "./converter.interfaces";
import enumsConverter from "./luahelp-enum";
import functionsConverter from "./luahelp-functions";
import { parse } from "./parser";

async function writeLuaMeta(mode: LuaHelpDocumentModes, lines: string[]) {
  await fsp.writeFile(
    `luaLib/library/tfm.${mode}.lua`,
    "--- @meta\n" +
      "-- !! This file is generated by an NPM script. !!\n\n" +
      lines.join("\n")
  );
}

(async () => {
  console.log("Parsing LuaHelp...");

  const ast = parse((await fsp.readFile("./luahelp.txt")).toString());
  // prettier-ignore
  const converters = [
    enumsConverter,
    functionsConverter
  ] as Converter[];

  console.log("Generating...");
  for (const { type, convert } of converters) {
    await writeLuaMeta(type as LuaHelpDocumentModes, convert(ast));
  }
  console.log("Wrote output to file.");
})();
