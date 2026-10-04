import { type ChildProcess, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { AxeBuilder } from "@axe-core/playwright";
import {
  type APIRequestContext,
  expect,
  type Locator,
  type Page,
  type Route,
  test,
} from "@playwright/test";
import { z } from "zod";

const password = "Synthetic-browser-password-2026";
async function unavailableResponse(route: Route) {
  await route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({
      code: "unavailable",
      message: "The response could not be confirmed. Try again.",
    }),
  });
}
async function emailLink(
  request: APIRequestContext,
  email: string,
  subject: string,
  origin: string,
) {
  let link = "";
  await expect
    .poll(
      async () => {
        const response = await request.get(
          `${process.env.TEST_MAILPIT_URL ?? "http://127.0.0.1:8025"}/api/v1/search?query=${encodeURIComponent(`to:${email} subject:"${subject}"`)}`,
        );
        const data = z
          .object({ messages: z.array(z.object({ ID: z.string() })) })
          .parse(await response.json());
        const id = data.messages[0]?.ID;
        if (!id) return false;
        const message = await request.get(
          `${process.env.TEST_MAILPIT_URL ?? "http://127.0.0.1:8025"}/api/v1/message/${id}`,
        );
        const body = z.object({ Text: z.string() }).parse(await message.json());
        link =
          body.Text.split(/\s+/).find(
            (value) =>
              value.startsWith(`${origin}/`) && value.includes("#token="),
          ) ?? "";
        return !!link;
      },
      { timeout: 15000 },
    )
    .toBe(true);
  return link;
}
async function startHarness(port: number, email: string) {
  const child = spawn("node", ["scripts/identity-browser.mjs"], {
    env: {
      ...process.env,
      BROWSER_PORT: String(port),
      BROWSER_OWNER_EMAIL: email,
    },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  await new Promise<void>((resolve, reject) => {
    let output = "";
    let diagnostic = "";
    const deadline = setTimeout(() => {
      child.kill("SIGTERM");
      reject(
        new Error(
          `Disposable browser harness did not become ready: ${output.slice(-500)} ${diagnostic.slice(-2000)}`,
        ),
      );
    }, 30000);
    child.stdout?.on("data", (chunk) => {
      output += String(chunk);
      if (output.includes("IDENTITY_BROWSER_READY")) {
        clearTimeout(deadline);
        resolve();
      }
    });
    child.on("exit", (code) => {
      clearTimeout(deadline);
      reject(
        new Error(
          `Disposable browser harness exited ${code}: ${output.slice(-500)} ${diagnostic.slice(-2000)}`,
        ),
      );
    });
    child.stderr?.on("data", (chunk) => {
      diagnostic += String(chunk);
      for (const line of String(chunk).split("\n"))
        if (
          /^Application request failed (?:[A-Z0-9]{5}|unexpected)$/.test(line)
        )
          console.error(line);
    });
  });
  return child;
}
async function stopHarness(child: ChildProcess) {
  if (!child.pid) return;
  const exited = new Promise<void>((resolve) =>
    child.once("exit", () => resolve()),
  );
  child.kill("SIGTERM");
  await exited;
}
async function fillSignIn(page: Page, email: string, pw = password) {
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(pw);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Make yourself at home." }),
  ).toBeVisible();
}
async function finishSetup(page: Page, language: string) {
  await page.getByLabel("Interaction language").selectOption(language);
  await page.getByRole("button", { name: "Save and continue" }).click();
  await expect(
    page.getByText("Presentation defaults", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save and continue" }).click();
  await page
    .getByRole("checkbox", {
      name: "I have read this operator-access disclosure",
    })
    .check();
  await page.getByRole("button", { name: "Save and continue" }).click();
  await page
    .getByRole("button", { name: "Accept and finish basic setup" })
    .click();
  await expect(page.getByText("Basic setup complete")).toBeVisible();
}
async function tabTo(page: Page, target: Locator) {
  for (let i = 0; i < 60; i++) {
    if (await target.evaluate((element) => element === document.activeElement))
      return;
    await page.keyboard.press("Tab");
  }
  throw new Error("Setup control could not be reached by keyboard");
}
async function finishSetupWithKeyboard(page: Page) {
  const submit = () => page.getByRole("button", { name: "Save and continue" });
  await tabTo(page, submit());
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Presentation defaults", { exact: true }),
  ).toBeVisible();
  await tabTo(page, submit());
  await page.keyboard.press("Enter");
  const acknowledgement = page.getByRole("checkbox", {
    name: "I have read this operator-access disclosure",
  });
  await expect(acknowledgement).toBeVisible();
  await tabTo(page, acknowledgement);
  await page.keyboard.press("Space");
  await tabTo(page, submit());
  await page.keyboard.press("Enter");
  const finish = page.getByRole("button", {
    name: "Accept and finish basic setup",
  });
  await expect(finish).toBeVisible();
  await tabTo(page, finish);
  await page.keyboard.press("Enter");
  await expect(page.getByText("Basic setup complete")).toBeVisible();
}
async function enroll(
  page: Page,
  request: APIRequestContext,
  email: string,
  name: string,
  origin: string,
) {
  await page.goto(
    await emailLink(request, email, "Your invitation to Noola", origin),
  );
  await expect(page).not.toHaveURL(/#token=/);
  await page.getByLabel("Invited email").fill(email);
  await page.getByLabel("Display name", { exact: true }).fill(name);
  await page.getByLabel("Choose a password").fill("short");
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page.getByLabel("Choose a password")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByLabel("Choose a password")).toBeFocused();
  await page.getByLabel("Choose a password").fill(password);
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(
    page.getByText(/Your account is ready for verification/),
  ).toBeVisible();
  await page.goto(
    await emailLink(request, email, "Verify your Noola email", origin),
  );
  await page.getByRole("button", { name: "Verify my email" }).click();
  await expect(page.getByText(/Email verified/)).toBeVisible();
  await page.getByRole("link", { name: "Continue to sign in" }).click();
  await fillSignIn(page, email);
}
test("two independent adults complete account setup, guardian approval, locks, browser clearing, and recovery", async ({
  browser,
  request,
}, testInfo) => {
  test.setTimeout(180000);
  const port = 5180 + testInfo.workerIndex;
  const origin = `http://localhost:${port}`;
  const suffix = randomUUID();
  const ownerEmail = `owner-${suffix}@browser.test`;
  const adultEmail = `adult-${suffix}@browser.test`;
  const harness = await startHarness(port, ownerEmail);
  const ownerContext = await browser.newContext({
    baseURL: origin,
    ...(testInfo.project.use.viewport
      ? { viewport: testInfo.project.use.viewport }
      : {}),
    ...(testInfo.project.use.isMobile
      ? { isMobile: true, hasTouch: true }
      : {}),
  });
  const adultContext = await browser.newContext({
    baseURL: origin,
    ...(testInfo.project.use.viewport
      ? { viewport: testInfo.project.use.viewport }
      : {}),
    ...(testInfo.project.use.isMobile
      ? { isMobile: true, hasTouch: true }
      : {}),
  });
  const ownerPage = await ownerContext.newPage();
  const adultPage = await adultContext.newPage();
  const errors: string[] = [];
  ownerPage.on("pageerror", (error) => errors.push(error.message));
  adultPage.on("pageerror", (error) => errors.push(error.message));
  try {
    await enroll(ownerPage, request, ownerEmail, "Browser Owner", origin);
    expect(
      (await new AxeBuilder({ page: ownerPage }).analyze()).violations,
    ).toEqual([]);
    await finishSetup(ownerPage, "Tamil");
    await ownerPage.getByRole("button", { name: "Devices & security" }).click();
    await ownerPage.getByLabel("Device mode").selectOption("personal");
    await ownerPage
      .getByRole("button", { name: "Save device preferences" })
      .click();
    await expect(
      ownerPage.getByRole("status").filter({ hasText: "Saved." }),
    ).toBeVisible();
    const oldSession = await browser.newContext({ baseURL: origin });
    const newSession = await browser.newContext({ baseURL: origin });
    const signInSession = async (context: typeof oldSession) => {
      expect(
        (
          await context.request.post("/api/auth/sign-in/email", {
            headers: { Origin: origin },
            data: { email: ownerEmail, password },
          })
        ).status(),
      ).toBe(200);
    };
    const revocationIds: string[] = [];
    try {
      await signInSession(oldSession);
      expect((await oldSession.request.get("/api/v1/me")).status()).toBe(200);
      await ownerPage.route("**/api/v1/devices", async (route) => {
        const input = route.request().postDataJSON();
        if (input?.action !== "revoke-others") return route.continue();
        revocationIds.push(
          z.object({ requestId: z.uuid() }).parse(input).requestId,
        );
        const response = await route.fetch();
        // The effect commits, but the browser cannot confirm its response.
        if (revocationIds.length === 1) await unavailableResponse(route);
        else await route.fulfill({ response });
      });
      const revoke = ownerPage.getByRole("button", {
        name: "Revoke other sessions",
      });
      await revoke.click();
      await expect(ownerPage.getByRole("alert")).toBeVisible();
      expect((await oldSession.request.get("/api/v1/me")).status()).toBe(401);
      await revoke.click();
      await expect(
        ownerPage.getByRole("status").filter({ hasText: "Saved." }),
      ).toBeVisible();
      expect(revocationIds[1]).toBe(revocationIds[0]);
      // No /me call: this new auth session has no device-policy row yet.
      await signInSession(newSession);
      await revoke.click();
      await expect(
        ownerPage.getByRole("status").filter({ hasText: "Saved." }),
      ).toBeVisible();
      expect(revocationIds).toHaveLength(3);
      expect(revocationIds[2]).not.toBe(revocationIds[1]);
      expect((await newSession.request.get("/api/v1/me")).status()).toBe(401);
      expect((await ownerContext.request.get("/api/v1/me")).status()).toBe(200);
    } finally {
      await ownerPage.unroute("**/api/v1/devices");
      await oldSession.close();
      await newSession.close();
    }
    // Shared-mode locking survives client navigation to either public route.
    for (const link of ["noola.", "Account recovery guide"]) {
      await ownerPage.getByLabel("Device mode").selectOption("shared");
      await ownerPage
        .getByRole("button", { name: "Save device preferences" })
        .click();
      await expect(
        ownerPage.getByRole("status").filter({ hasText: "Saved." }),
      ).toBeVisible();
      await ownerPage.getByRole("link", { name: link, exact: true }).click();
      await expect(ownerPage).toHaveURL(
        link === "noola." ? `${origin}/` : `${origin}/recovery`,
      );
      await expect(ownerPage.getByRole("heading", { level: 1 })).toBeVisible();
      await ownerContext.setOffline(true);
      await ownerPage.evaluate(() => {
        Object.defineProperty(document, "visibilityState", {
          configurable: true,
          value: "hidden",
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await expect(
        ownerPage.getByRole("heading", { name: "Welcome back." }),
      ).toBeVisible();
      await expect
        .poll(() =>
          ownerPage.evaluate(() => !!localStorage.getItem("noola-restriction")),
        )
        .toBe(true);
      await ownerContext.setOffline(false);
      await ownerPage.goto(`${origin}/account`);
      await expect(
        ownerPage.getByRole("heading", { name: "Welcome back." }),
      ).toBeVisible();
      expect((await ownerContext.request.get("/api/v1/me")).status()).toBe(423);
      await fillSignIn(ownerPage, ownerEmail);
      await ownerPage
        .getByRole("button", { name: "Devices & security" })
        .click();
    }
    // A cookie arriving directly on a public page also discovers its policy.
    const publicContext = await browser.newContext({
      baseURL: origin,
      storageState: await ownerContext.storageState(),
    });
    try {
      const publicPage = await publicContext.newPage();
      const meResponse = publicPage.waitForResponse(
        (response) =>
          response.url().endsWith("/api/v1/me") && response.status() === 200,
      );
      await publicPage.goto(origin);
      await (await meResponse).finished();
      await publicPage.evaluate(() => {
        Object.defineProperty(document, "visibilityState", {
          configurable: true,
          value: "hidden",
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await expect(
        publicPage.getByRole("heading", { name: "Welcome back." }),
      ).toBeVisible();
      await expect
        .poll(async () =>
          (await publicContext.request.get("/api/v1/me")).status(),
        )
        .toBe(423);
    } finally {
      await publicContext.close();
    }
    await ownerPage.goto(`${origin}/sign-in`);
    await fillSignIn(ownerPage, ownerEmail);
    await ownerPage.getByRole("button", { name: "Devices & security" }).click();
    await ownerPage.getByLabel("Device mode").selectOption("personal");
    await ownerPage
      .getByRole("button", { name: "Save device preferences" })
      .click();
    await expect(
      ownerPage.getByRole("status").filter({ hasText: "Saved." }),
    ).toBeVisible();
    await ownerPage
      .getByRole("button", { name: "Household rules", exact: true })
      .click();
    await ownerPage.getByLabel("Other adult’s email").fill(adultEmail);
    await ownerPage.getByRole("button", { name: "Send invitation" }).click();
    await expect(
      ownerPage.getByText(adultEmail, { exact: true }),
    ).toBeVisible();
    await ownerPage
      .getByRole("button", { name: "Accept this revision" })
      .click();
    await enroll(adultPage, request, adultEmail, "Browser Adult", origin);
    await finishSetupWithKeyboard(adultPage);
    await adultPage.getByRole("button", { name: "Devices & security" }).click();
    await adultPage.getByLabel("Device mode").selectOption("personal");
    await adultPage
      .getByRole("button", { name: "Save device preferences" })
      .click();
    await expect(
      adultPage.getByRole("status").filter({ hasText: "Saved." }),
    ).toBeVisible();
    await adultPage
      .getByRole("button", { name: "Household rules", exact: true })
      .click();
    await adultPage
      .getByRole("button", { name: "Accept this revision" })
      .click();
    await expect(
      adultPage.getByText(/Both adults accepted household rules/),
    ).toBeVisible();
    expect(
      (await new AxeBuilder({ page: adultPage }).analyze()).violations,
    ).toEqual([]);
    await ownerPage.getByRole("button", { name: "Dependent profile" }).click();
    await ownerPage
      .getByLabel("Dependent display name")
      .fill("Synthetic Vihaan");
    await ownerPage
      .getByRole("button", { name: "Create dependent profile" })
      .click();
    await expect(
      ownerPage.getByText("Synthetic Vihaan", { exact: true }),
    ).toBeVisible();
    await ownerPage
      .getByRole("button", { name: "Propose guardianship" })
      .last()
      .click();
    await ownerPage
      .getByRole("button", { name: "Approve this guardian change" })
      .click();
    await expect(
      ownerPage.getByRole("status").filter({ hasText: "Saved." }),
    ).toBeVisible();
    await adultPage.getByRole("button", { name: "Dependent profile" }).click();
    await adultPage
      .getByRole("button", { name: "Accept my guardian role change" })
      .click();
    await expect(
      adultPage.getByText("Accepted guardian", { exact: true }),
    ).toBeVisible();
    await expect(
      adultPage.getByRole("button", { name: "Save dependent profile" }),
    ).toHaveCount(0);
    expect(
      (await new AxeBuilder({ page: adultPage }).analyze()).violations,
    ).toEqual([]);
    await ownerPage
      .getByRole("button", { name: "Relationship aliases" })
      .click();
    await ownerPage.getByLabel("Your phrase").fill("Mom");
    await ownerPage
      .getByLabel("Person’s display name")
      .fill("Owner’s private Mom");
    await ownerPage.getByRole("button", { name: "Save my mapping" }).click();
    await expect(
      ownerPage.getByText("Mom → Owner’s private Mom"),
    ).toBeVisible();
    await adultPage
      .getByRole("button", { name: "Relationship aliases" })
      .click();
    await expect(adultPage.getByText("Owner’s private Mom")).toHaveCount(0);
    await ownerPage.goBack();
    await expect(
      ownerPage.getByRole("heading", { name: "Optional dependent setup" }),
    ).toBeVisible();
    await ownerPage.goForward();
    await expect(
      ownerPage.getByRole("heading", { name: "Your relationship references" }),
    ).toBeVisible();
    const tab = await ownerContext.newPage();
    await tab.goto(`${origin}/account?panel=aliases`);
    await expect(tab.getByText("Owner’s private Mom")).toBeVisible();
    // Release a deliberately delayed private response after sign-out.
    let release: () => void = () => {};
    const hold = new Promise<void>((resolve) => {
      release = resolve;
    });
    await tab.route("**/api/v1/aliases", async (route) => {
      const response = await route.fetch();
      await hold;
      await route.fulfill({ response });
    });
    await tab
      .getByRole("button", { name: "Household rules", exact: true })
      .click();
    await tab.getByRole("button", { name: "Relationship aliases" }).click();
    await ownerPage
      .getByRole("button", { name: "Sign out", exact: true })
      .click();
    release();
    await expect(
      tab.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await expect(tab.getByText("Owner’s private Mom")).toHaveCount(0);
    await tab.close();
    await ownerPage.goBack();
    await expect(ownerPage.getByText("Owner’s private Mom")).toHaveCount(0);
    await ownerPage.goto(`${origin}/sign-in`);
    await fillSignIn(ownerPage, ownerEmail);
    // Backgrounding offline must clear immediately and reconcile before reuse.
    await ownerContext.setOffline(true);
    await ownerPage.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(
      ownerPage.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await expect(
      ownerPage.getByText(/Server lock or sign-out is unconfirmed/),
    ).toBeVisible();
    await ownerContext.setOffline(false);
    await ownerPage.goto(`${origin}/account`);
    await expect(
      ownerPage.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await fillSignIn(ownerPage, ownerEmail);
    await ownerContext.setOffline(true);
    await ownerPage
      .getByRole("button", { name: "Sign out", exact: true })
      .click();
    await expect(
      ownerPage.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await expect
      .poll(() =>
        ownerPage.evaluate(() => !!localStorage.getItem("noola-restriction")),
      )
      .toBe(true);
    // Backgrounding and unloading must preserve the stronger offline sign-out.
    expect(
      await ownerPage.evaluate(() => {
        document.dispatchEvent(new Event("visibilitychange"));
        window.dispatchEvent(new PageTransitionEvent("pagehide"));
        return JSON.parse(localStorage.getItem("noola-restriction") ?? "null")
          ?.kind;
      }),
    ).toBe("sign-out");
    await expect(
      ownerPage.getByText(/Server lock or sign-out is unconfirmed/),
    ).toBeVisible();
    await ownerContext.setOffline(false);
    await ownerPage.goto(`${origin}/forgot-password`);
    await expect
      .poll(() =>
        ownerPage.evaluate(() => localStorage.getItem("noola-restriction")),
      )
      .toBeNull();
    expect((await ownerContext.request.get("/api/v1/me")).status()).toBe(401);
    await ownerPage.getByLabel("Your email").fill(ownerEmail);
    await ownerPage.getByRole("button", { name: "Request reset link" }).click();
    await expect(
      ownerPage.getByText(/If this address is eligible/),
    ).toBeVisible();
    await ownerPage.goto(
      await emailLink(request, ownerEmail, "Reset your Noola password", origin),
    );
    await ownerPage
      .getByLabel("New password")
      .fill("Independent-browser-reset-2026");
    await ownerPage.getByRole("button", { name: "Reset my password" }).click();
    await expect(
      ownerPage.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await fillSignIn(ownerPage, ownerEmail, "Independent-browser-reset-2026");
    await adultPage.getByRole("button", { name: "Your setup" }).click();
    await expect(adultPage.getByText("English", { exact: true })).toBeVisible();
    expect(
      (await new AxeBuilder({ page: adultPage }).analyze()).violations,
    ).toEqual([]);
    await adultPage.screenshot({
      path: testInfo.outputPath("account.png"),
      fullPage: true,
    });
    await adultPage.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await adultPage.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  } finally {
    await ownerContext.close();
    await adultContext.close();
    await stopHarness(harness);
  }
});

async function setVisibility(page: Page, state: "hidden" | "visible") {
  await page.evaluate((value) => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  }, state);
}

test("background checks handle unknown and remotely changed policies while preserving personal sessions", async ({
  browser,
  request,
}, testInfo) => {
  test.setTimeout(90000);
  const origin = `http://localhost:${5180 + testInfo.workerIndex}`;
  const email = `boundary-${randomUUID()}@browser.test`;
  const harness = await startHarness(5180 + testInfo.workerIndex, email);
  const context = await browser.newContext({ baseURL: origin });
  const controller = await browser.newContext({ baseURL: origin });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await enroll(page, request, email, "Boundary Owner", origin);
    await page.getByRole("button", { name: "Devices & security" }).click();
    await page.getByLabel("Device mode").selectOption("personal");
    await page.getByRole("button", { name: "Save device preferences" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Saved." }),
    ).toBeVisible();
    const device = z
      .object({ device: z.object({ id: z.string() }) })
      .parse(await (await context.request.get("/api/v1/me")).json()).device;
    // A valid personal session hides content and resumes without a password.
    await setVisibility(page, "hidden");
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("noola-restriction")),
      )
      .toBeNull();
    expect((await context.request.get("/api/v1/me")).status()).toBe(200);
    await setVisibility(page, "visible");
    await expect(
      page.getByRole("heading", { name: "Your devices and security" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "noola.", exact: true }).click();
    await expect(page).toHaveURL(`${origin}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      (
        await controller.request.post("/api/auth/sign-in/email", {
          headers: { Origin: origin },
          data: { email, password },
        })
      ).status(),
    ).toBe(200);
    expect(
      (
        await controller.request.post("/api/v1/devices", {
          headers: { Origin: origin },
          data: {
            action: "update",
            deviceId: device.id,
            mode: "shared",
            label: "Changed remotely",
          },
        })
      ).status(),
    ).toBe(200);
    await setVisibility(page, "hidden");
    await expect(
      page.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await expect
      .poll(async () => (await context.request.get("/api/v1/me")).status())
      .toBe(423);
    await page.goto(`${origin}/sign-in`);
    await fillSignIn(page, email);

    for (const discovery of ["failed", "delayed"]) {
      const publicContext = await browser.newContext({
        baseURL: origin,
        storageState: await context.storageState(),
      });
      let release: () => void = () => {};
      const hold = new Promise<void>((resolve) => {
        release = resolve;
      });
      try {
        const publicPage = await publicContext.newPage();
        publicPage.on("pageerror", (error) => errors.push(error.message));
        let attempts = 0;
        const replies: Promise<void>[] = [];
        await publicPage.route("**/api/v1/me", (route) => {
          attempts++;
          const reply = (async () => {
            if (discovery === "failed") return unavailableResponse(route);
            const response = await route.fetch();
            await hold;
            await route.fulfill({ response });
          })();
          replies.push(reply);
          return reply;
        });
        await publicPage.goto(origin);
        await expect(
          publicPage.getByRole("heading", { level: 1 }),
        ).toBeVisible();
        await expect.poll(() => attempts).toBeGreaterThan(0);
        if (discovery === "failed") await publicContext.setOffline(true);
        await setVisibility(publicPage, "hidden");
        await expect(
          publicPage.getByRole("heading", { name: "Welcome back." }),
        ).toBeVisible();
        if (discovery === "failed")
          await expect
            .poll(() =>
              publicPage.evaluate(
                () => !!localStorage.getItem("noola-restriction"),
              ),
            )
            .toBe(true);
        // Remember the background even if the tab resumes before discovery.
        await setVisibility(publicPage, "visible");
        if (discovery === "failed") await publicContext.setOffline(false);
        release();
        await Promise.all(replies);
        await publicPage.unrouteAll({ behavior: "wait" });
        if (discovery === "failed") await publicPage.goto(`${origin}/account`);
        await expect
          .poll(async () =>
            (await publicContext.request.get("/api/v1/me")).status(),
          )
          .toBe(423);
        await expect(
          publicPage.getByRole("heading", { name: "Welcome back." }),
        ).toBeVisible();
        await expect(
          publicPage.getByRole("heading", { name: "Make yourself at home." }),
        ).toHaveCount(0);
      } finally {
        release();
        await publicContext.close();
      }
      await page.goto(`${origin}/sign-in`);
      await fillSignIn(page, email);
      expect((await context.request.get("/api/v1/me")).status()).toBe(200);
    }
    // A failed private refetch hides authority but must retain cookie locking.
    await page.route("**/api/v1/me", unavailableResponse);
    await page.getByRole("button", { name: "Devices & security" }).click();
    await expect(
      page.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
    await setVisibility(page, "hidden");
    await expect
      .poll(async () => (await context.request.get("/api/v1/me")).status())
      .toBe(423);
    await page.unroute("**/api/v1/me");
    await page.goto(`${origin}/sign-in`);
    await fillSignIn(page, email);
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await controller.close();
    await stopHarness(harness);
  }
});
