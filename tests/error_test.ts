import { ServerContext } from "../server.ts";
import { assert, assertEquals, assertStringIncludes } from "./deps.ts";
import manifest from "./fixture_error/fresh.gen.ts";

const ctx = await ServerContext.fromManifest(manifest);
const router = ctx.handler();

Deno.test("error page rendered", async () => {
  const resp = await router(new Request("https://fresh.deno.dev/"));
  assert(resp);
  assertEquals(resp.status, 500);
  assertEquals(resp.headers.get("content-type"), "text/html; charset=utf-8");
  const body = await resp.text();
  assertStringIncludes(
    body,
    `An error occured during route handling or page rendering.`,
  );
  assertStringIncludes(body, `Error: boom!`);
  assertStringIncludes(body, `at render`);
});