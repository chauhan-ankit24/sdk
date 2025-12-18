import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  external: ["react", "react-dom", "recharts"],
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],

  plugins: [
    peerDepsExternal(),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
      extensions: [".css"],
    }),
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
    }),
  ],
};
