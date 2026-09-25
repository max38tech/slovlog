"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { togglePostPublishAction, deletePostAction } from "@/lib/actions/posts";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";

interface PostTableActionsProps {
  postId: string;
  published: boolean;
}

export function PostTableActions({ postId, published }: PostTableActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTogglePublish = () => {
    startTransition(async () => {
      const res = await togglePostPublishAction(postId, published);
      if (res.error) {
        toast.error("Could not toggle status: " + res.error);
      } else {
        toast.success(res.published ? "Post published!" : "Post moved to drafts.");
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    startTransition(async () => {
      const res = await deletePostAction(postId);
      if (res?.error) {
        toast.error("Failed to delete post: " + res.error);
      } else {
        toast.success("Story deleted.");
        router.refresh();
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button
        onClick={handleTogglePublish}
        disabled={isPending}
        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
        title={published ? "Unpublish story" : "Publish story"}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : published ? (
          <EyeOff className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        ) : (
          <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
        title="Delete story"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
