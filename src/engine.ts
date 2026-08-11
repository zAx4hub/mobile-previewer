/** mobile-previewer — browser device lab by zAx4hub */
export type DeviceProfile = {
  id: string;
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  mobile: boolean;
  userAgent: string;
  touch: boolean;
  category: "phone" | "tablet" | "desktop" | "foldable";
};

export type PreviewRequest = {
  url?: string;
  devices?: string[];
  orientation?: "portrait" | "landscape";
  network?: "offline" | "slow-3g" | "4g" | "wifi";
};

export type Viewport = {
  deviceId: string;
  name: string;
  width: number;
  height: number;
  dpr: number;
  userAgent: string;
  orientation: "portrait" | "landscape";
  touch: boolean;
  cssMedia: string[];
};

export type Report = {
  project: string;
  author: string;
  summary: string;
  score: number;
  viewports: Viewport[];
  network: { label: string; rttMs: number; downlinkMbps: number; offline: boolean };
  metrics: Record<string, number>;
};

export const DEVICES: Record<string, DeviceProfile> = {
  "iphone-15": {
    id: "iphone-15",
    name: "iPhone 15",
    width: 393,
    height: 852,
    deviceScaleFactor: 3,
    mobile: true,
    touch: true,
    category: "phone",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  "pixel-8": {
    id: "pixel-8",
    name: "Pixel 8",
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625,
    mobile: true,
    touch: true,
    category: "phone",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
  "ipad-air": {
    id: "ipad-air",
    name: "iPad Air",
    width: 820,
    height: 1180,
    deviceScaleFactor: 2,
    mobile: true,
    touch: true,
    category: "tablet",
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  "galaxy-fold": {
    id: "galaxy-fold",
    name: "Galaxy Z Fold (unfolded)",
    width: 768,
    height: 1076,
    deviceScaleFactor: 2.5,
    mobile: true,
    touch: true,
    category: "foldable",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; SM-F946B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
  "desktop-hd": {
    id: "desktop-hd",
    name: "Desktop HD",
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    touch: false,
    category: "desktop",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
};

const NETWORK = {
  offline: { label: "offline", rttMs: 0, downlinkMbps: 0, offline: true },
  "slow-3g": { label: "slow-3g", rttMs: 400, downlinkMbps: 0.4, offline: false },
  "4g": { label: "4g", rttMs: 70, downlinkMbps: 10, offline: false },
  wifi: { label: "wifi", rttMs: 20, downlinkMbps: 50, offline: false },
} as const;

export function listDevices(): DeviceProfile[] {
  return Object.values(DEVICES);
}

export function resolveViewport(
  deviceId: string,
  orientation: "portrait" | "landscape" = "portrait",
): Viewport {
  const d = DEVICES[deviceId];
  if (!d) throw new Error(`Unknown device: ${deviceId}`);
  const landscape = orientation === "landscape";
  const width = landscape ? Math.max(d.width, d.height) : Math.min(d.width, d.height);
  const height = landscape ? Math.min(d.width, d.height) : Math.max(d.width, d.height);
  // For desktop keep native
  const w = d.category === "desktop" ? d.width : width;
  const h = d.category === "desktop" ? d.height : height;
  const media = [
    `(width: ${w}px)`,
    `(height: ${h}px)`,
    d.mobile ? "(pointer: coarse)" : "(pointer: fine)",
    w < 600 ? "(max-width: 599px)" : w < 1024 ? "(max-width: 1023px)" : "(min-width: 1024px)",
  ];
  return {
    deviceId: d.id,
    name: d.name,
    width: w,
    height: h,
    dpr: d.deviceScaleFactor,
    userAgent: d.userAgent,
    orientation: d.category === "desktop" ? "landscape" : orientation,
    touch: d.touch,
    cssMedia: media,
  };
}

export function run(input: PreviewRequest = {}): Report {
  const ids = input.devices?.length ? input.devices : ["iphone-15", "pixel-8", "ipad-air", "desktop-hd"];
  const orientation = input.orientation ?? "portrait";
  const viewports: Viewport[] = [];
  const missing: string[] = [];
  for (const id of ids) {
    if (!DEVICES[id]) {
      missing.push(id);
      continue;
    }
    viewports.push(resolveViewport(id, orientation));
  }
  const network = NETWORK[input.network ?? "wifi"];
  const coverage = new Set(viewports.map((v) => DEVICES[v.deviceId].category)).size;
  const score = Math.min(100, viewports.length * 18 + coverage * 8) - missing.length * 10;

  return {
    project: "mobile-previewer",
    author: "zAx4hub",
    summary: `Preview lab: ${viewports.length} viewports for ${input.url ?? "about:blank"} @ ${network.label}`,
    score: Math.max(0, score),
    viewports,
    network,
    metrics: {
      devices: viewports.length,
      missing: missing.length,
      categories: coverage,
      maxDpr: Math.max(0, ...viewports.map((v) => v.dpr)),
      touchDevices: viewports.filter((v) => v.touch).length,
    },
  };
}

export function demo(): Report {
  return run({
    url: "https://example.com",
    devices: ["iphone-15", "pixel-8", "ipad-air", "galaxy-fold", "desktop-hd"],
    orientation: "portrait",
    network: "slow-3g",
  });
}

export function inspect() {
  return {
    name: "mobile-previewer",
    author: "zAx4hub",
    oneLiner: "Browser device lab",
    version: "0.1.0",
    devices: Object.keys(DEVICES),
    networks: Object.keys(NETWORK),
    commands: ["demo", "run", "inspect"],
  };
}
