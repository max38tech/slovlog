import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: post, error } = await (supabase.from("posts") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  return <PostEditor post={post} />;
}
