// Simple Node version check to warn about incompatible Node versions for Vite 7+
const [majorStr, minorStr] = process.versions.node.split('.');
const major = Number(majorStr);
const minor = Number(minorStr);

function isSupported() {
  if (major > 22) return true;
  if (major === 22) return minor >= 12;
  if (major === 20) return minor >= 19;
  return false;
}

if (!isSupported()) {
  console.warn('\n\x1b[33mWARNING:\x1b[0m Detected Node ' + process.versions.node + '.');
  console.warn(
    'Vite 7 requires Node >= 20.19.0 or >= 22.12.0. Some tools may warn or behave unexpectedly.'
  );
  console.warn(
    'Please consider upgrading Node for the best compatibility (nvm, n, Volta, or the official installer).\n'
  );
}
