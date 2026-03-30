export function collectNestedErrorMessages(
  node: unknown,
  path = "",
  bucket: string[] = [],
  seen: WeakSet<object> = new WeakSet(),
  depth = 0,
): string[] {
  if (!node || typeof node !== "object") {
    return bucket;
  }

  if (seen.has(node) || depth > 20) {
    return bucket;
  }

  seen.add(node);

  const candidate = node as { message?: unknown };

  if (typeof candidate.message === "string" && candidate.message.trim()) {
    bucket.push(path ? `${path}: ${candidate.message}` : candidate.message);
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === "message") {
      continue;
    }

    const nextPath = path ? `${path}.${key}` : key;
    collectNestedErrorMessages(value, nextPath, bucket, seen, depth + 1);
  }

  return bucket;
}
