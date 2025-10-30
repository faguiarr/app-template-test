## Development Prompt — App Template (Vite + React + TS)

You are a code agent working in this repository (Vite + React + TypeScript).
Your goal is to implement features always using MUI (Material UI) and strictly following the rules below.

---

### UI (mandatory)

ALWAYS use **MUI** for UI components:
Import from `@mui/material`.

Tailwind is allowed **only** for layout and spacing utilities:
`flex`, `grid`, `gap-*`, `w-*`, `h-*`, `p-*`, `m-*`, etc.

Do **not** use any other component libraries when MUI provides an equivalent.

Colors and theme customization must be done exclusively through **MUI**,
using `ThemeProvider` and `createTheme`.
No external theme libraries are allowed.

---

### Project (mandatory)

Follow the existing project structure.
Create new folders/files only when necessary, for example:

```
src/
  services/
  pages/
  components/
  context/
```

Do not create folders named **lib** anywhere in the project.
If a new folder is needed, use descriptive names such as `utils/`, `hooks/`, or `helpers/`.

Never hardcode any **IDs**, **workspaces**, **linkUids**, **tags**, or any other values related to request parameters directly in the code.
All such dynamic parameters must be defined inside `public/app-config.dev.json` to simplify maintenance and keep parameters dynamic.

---

### AppConfigContext

All app configuration (e.g., workspace IDs, workflow UIDs, etc.) must come from **AppConfigContext**.

#### Development

In development, configuration values are loaded from the JSON file:
`public/app-config.dev.json`

Example:

```json
{
  "workspaces": {
    "metrics": "WORKSPACE_METRICS",
    "fundRules": "WORKSPACE_FUND_RULES",
    "operational": "WORKSPACE_OPERATIONAL"
  },
  "linkUids": {
    "fund": "&FUND_LINK",
    "activity": "&ACTIVITY_LINK"
  },
  "tags": {
    "locates": "locates",
    "dateTag": "20251020"
  }
}
```

> Important: **Do not include `#` or `&` symbols** in the values inside `app-config.dev.json`.
> These characters must be appended dynamically when building the request query.

This file is automatically loaded and merged into `AppConfigContext` during development.

#### Production

In production, configurations are automatically provided via **BroadcastChannel**.
You do not need to implement this — they are already available through `AppConfigContext`.

---

### HTTP (mandatory rules)

Base your implementation on the **Everysk API** documentation.

Always include the **workspace** (from `AppConfigContext`):

* **GET:** send it in the **URL**
* **POST / PUT / PATCH:** send it in the **body**

For endpoints with `with_data`, always include `with_data=true` in the URL.

When filtering by **tag** or **linkUid**, the URL parameter name must always be `query`.

* Example with linkUid: `?query=&{linkUid}`
* Example with tag(s): `?query=#{tag}` or multiple tags separated by space `?query=#{tag1} #{tag2}`

These values must come from `AppConfigContext` and never be hardcoded. The special characters (`#`, `&`) should be added only when composing the request.

#### Environment setup:

* **Development:** use the **server proxy** (to avoid CORS) → requests go to `/api/*`
* **Production:** `baseUrl = "/"`

The frontend must forward all query parameters to the proxy or production domain.

---

### Broadcast Channel

Communication between apps must follow this standard payload format:

```json
{
  "type": "REFRESH",
  "payload": { ... }
}
```

Any action sent or received must follow this structure.

---

### Using React Query and Axios Together

All data fetching in the app should use **React Query** in combination with the custom **useAxios** hook.
This ensures caching, automatic refetching, and consistent request handling.

Preferred pattern example (Datastores):

```ts
import { useQuery } from '@tanstack/react-query';
import useAxios from '../hooks/useAxios';
import { useAppConfig } from '../contexts/appConfigContext/provider';
import { getDatastores } from '../services/datastores';

export function useDatastoresQuery() {
  const { api } = useAxios();
  const { appEnvironmentVar } = useAppConfig();
  const workspace = appEnvironmentVar?.workspaces?.metrics; // read from AppConfig

  const {
    data: datastores = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['datastores', workspace],
    queryFn: () => getDatastores(api, undefined, workspace, undefined, false),
    enabled: !!workspace,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return { datastores, loading, error };
}
```

Use this same approach for all requests: **React Query** for data management and caching, and **useAxios** for consistent API configuration. Never hardcode workspaces or other parameters; always read them from `AppConfigContext`.

---

### Accessing Config In Code (Examples)

Use `useAppConfig()` to read dynamic values from `AppConfigContext`. Do not import JSON directly.

#### Read workspaces / linkUids / tags

```ts
import { useAppConfig } from "../contexts/appConfigContext/provider"; // adjust path if needed

export function useDomainConfig() {
  const { appEnvironmentVar } = useAppConfig();

  const workspace = appEnvironmentVar?.workspaces?.metrics;
  const linkUid = appEnvironmentVar?.linkUids?.activity;
  const tag = appEnvironmentVar?.tags?.locates;

  return { workspace, linkUid, tag };
}
```

#### HTTP via Axios (GET with workspace and query param)

```ts
import useAxios from "../hooks/useAxios";
import { useAppConfig } from "../contexts/appConfigContext/provider";

export function useActivityService() {
  const { api } = useAxios(); // baseURL "/api"
  const { appEnvironmentVar } = useAppConfig();

  async function fetchActivities(params: Record<string, any> = {}) {
    const workspace = appEnvironmentVar?.workspaces?.metrics;
    const linkUid = appEnvironmentVar?.linkUids?.activity;

    if (!workspace || !linkUid) throw new Error("Missing workspace or linkUid in AppConfig");

    const queryParams = new URLSearchParams({
      workspace,
      with_data: "true",
      query: `&${linkUid}`, // dynamically prepend '&' to linkUid
      ...params,
    });

    const { data } = await api.get(`/activities?${queryParams.toString()}`);
    return data;
  }

  return { fetchActivities };
}
```

#### Filtering by tags dynamically

```ts
import useAxios from "../hooks/useAxios";
import { useAppConfig } from "../contexts/appConfigContext/provider";

export function useTaggedItemsService() {
  const { api } = useAxios();
  const { appEnvironmentVar } = useAppConfig();

  async function fetchByTags() {
    const workspace = appEnvironmentVar?.workspaces?.metrics;
    const tag1 = appEnvironmentVar?.tags?.locates;
    const tag2 = appEnvironmentVar?.tags?.dateTag;

    if (!workspace || !tag1) throw new Error("Missing workspace or tags in AppConfig");

    const queryParams = new URLSearchParams({
      workspace,
      with_data: "true",
      query: `#${tag1} #${tag2}`.trim(), // dynamically prepend '#' to tags
    });

    const { data } = await api.get(`/items?${queryParams.toString()}`);
    return data;
  }

  return { fetchByTags };
}
```

> Note: Always read configuration values via `useAppConfig()` and pass them dynamically to the request. Never hardcode IDs, workspaces, UIDs, tags, or query parameters. Symbols like `#` and `&` should always be added when composing the request, not stored in configuration files.

---

### Running on Replit

When working in **Replit**, you must run **both the frontend (Vite)** and the **proxy server (Node)** at the same time.

* The **frontend** runs the React app using Vite (`npm run dev`).
* The **proxy** must be running separately to handle API requests and avoid CORS issues.
* All frontend API requests are redirected to the proxy (using the `/api` path).

Example setup in Replit:

```
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Proxy server
npm run proxy
```

Ensure both are active for the app to function correctly in development.

---
