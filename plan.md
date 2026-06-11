1. **Add `Try Demo` Button in `src/app/auth/page.tsx`**
   - Add a "Try Demo" button below the login form in `src/app/auth/page.tsx` as an outlined CTA button with the label `✦ Try the Demo`.
   - Add a separator with "or" or "No account?" above the button, ensuring it looks consistent with the dark theme.
   - Attach an `onClick` handler that hits `/api/auth/demo` and redirects to `/characters` on success.
   - Handle 404 response errors (e.g. if the demo user isn't seeded).

2. **Create Demo Auth API Endpoint (`src/app/api/auth/demo/route.ts`)**
   - Create a `POST` route in `src/app/api/auth/demo/route.ts` that requires no body.
   - Find the user with `login_id = "mark"`.
   - If missing, return a 404 with `{ error: "Demo account not seeded. Run: npx tsx scripts/seed-demo.ts" }`.
   - If found, generate a JWT and set it in a cookie (using identical settings as `login/route.ts`), then return the user details.

3. **Complete Pre-Commit Steps**
   - Ensure proper testing, verification, review, and reflection are done on the project using `pre_commit_instructions`.

4. **Submit Change**
   - Provide a final commit message and submit.
