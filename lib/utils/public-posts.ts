export function isPostVisibleToUser(
  post: { published: boolean },
  isAdmin: boolean = false
): boolean {
  if (post.published) return true;
  return isAdmin;
}

export function calculateReadingTime(content: string = ""): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}
