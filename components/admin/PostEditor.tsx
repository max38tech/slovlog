"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  createPostAction,
  updatePostAction,
  deletePostAction,
} from "@/lib/actions/posts";
import { slugify } from "@/lib/utils/slug";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link as LinkIcon,
  Code,
  Eye,
  Columns2,
  Edit3,
  ArrowLeft,
  Trash2,
  Save,
  Loader2,
  MapPin,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    location: string | null;
    trip_date: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    published: boolean;
    featured: boolean;
    gallery_images: string[];
  };
}

export function PostEditor({ post }: PostEditorProps) {
  const isEditing = Boolean(post);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(post?.slug));
  const [location, setLocation] = useState(post?.location || "Ljubljana");
  const [tripDate, setTripDate] = useState(
    post?.trip_date || new Date().toISOString().split("T")[0]
  );
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    post?.gallery_images || []
  );
  const [galleryInput, setGalleryInput] = useState("");

  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugManual) {
      setSlug(slugify(newTitle));
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  const handleAddGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setGalleryImages([...galleryImages, galleryInput.trim()]);
    setGalleryInput("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for this story.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("location", location);
    formData.append("trip_date", tripDate);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("cover_image", coverImage);
    formData.append("published", String(published));
    formData.append("featured", String(featured));
    formData.append("gallery_images", galleryImages.join(","));

    startTransition(async () => {
      try {
        if (isEditing && post?.id) {
          await updatePostAction(post.id, formData);
          toast.success("Story updated successfully!");
        } else {
          await createPostAction(formData);
          toast.success("Story created successfully!");
        }
      } catch (err: any) {
        if (!err.message?.includes("NEXT_REDIRECT")) {
          toast.error(err.message || "Failed to save story.");
        }
      }
    });
  };

  const handleDelete = async () => {
    if (!post?.id) return;
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const res = await deletePostAction(post.id);
      if (res?.error) {
        toast.error("Failed to delete story: " + res.error);
      } else {
        toast.success("Story deleted.");
        router.push("/admin/posts");
        router.refresh();
      }
    });
  };

  const popularLocations = [
    "Ljubljana",
    "Lake Bled",
    "Lake Bohinj",
    "Soča Valley",
    "Piran",
    "Triglav National Park",
    "Postojna Cave",
    "Škocjan Caves",
    "Maribor",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-universa text-2xl font-normal text-slate-900 tracking-[0.06em] uppercase">
              {isEditing ? "Edit Travel Story" : "Write New Travel Story"}
            </h1>
            <p className="text-xs text-slate-500">
              Document memories, photos, and destinations in Slovenia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-medium border border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slovenia-blue hover:bg-slovenia-blue-dark text-white font-medium text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? "Save Changes" : "Publish Story"}
          </button>
        </div>
      </div>

      {/* Main Metadata Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Story Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Arriving in Ljubljana: Dragons, Bridges & Castle Views"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue font-medium"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                URL Slug
              </label>
              <span className="text-[11px] text-slate-400">
                slovlog.com/posts/<strong>{slug || "..."}</strong>
              </span>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setIsSlugManual(true);
              }}
              placeholder="auto-generated-slug"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Summary / Excerpt
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence preview for cards and search engines..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
            />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
          {/* Publish / Featured Toggles */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-800">Published to slovlog.com</span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 accent-slovenia-blue rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-800">Featured Story (Hero)</span>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 accent-slovenia-green-leaf rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slovenia-green-leaf" />
              Destination / Stop
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ljubljana"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
            />
            {/* Quick destination tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {popularLocations.slice(0, 6).map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition-colors ${
                    location === loc
                      ? "bg-slovenia-green/10 text-slovenia-green border-slovenia-green/30 font-medium"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slovenia-blue" />
              Trip Date
            </label>
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://... or choose from Media Library"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
            />
            {coverImage && (
              <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                <Image
                  src={coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split-View Markdown Editor */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Editor Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertMarkdown("**", "**")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Bold (**text**)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("*", "*")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Italic (*text*)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("## ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("### ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-slate-200 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown("> ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("- ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Bullet list"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("[", "](https://)")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("```\n", "\n```")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Code block"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("![Caption](", ")")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              title="Insert Image Markdown"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === "edit"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === "split"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[450px]">
          {/* Markdown Textarea */}
          {(viewMode === "edit" || viewMode === "split") && (
            <div className={viewMode === "edit" ? "col-span-2" : ""}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story in Markdown here... Use headers, bold text, lists, and images."
                className="w-full h-full min-h-[450px] p-5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-y"
              />
            </div>
          )}

          {/* Live Preview */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div
              className={`p-6 overflow-y-auto bg-slate-50/50 min-h-[450px] ${
                viewMode === "preview" ? "col-span-2" : ""
              }`}
            >
              <div className="prose prose-slate max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-slovenia-blue">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic">
                    Live Markdown preview will appear here as you write...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Manager */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-universa text-lg font-normal text-slate-900 tracking-[0.06em] uppercase flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-slovenia-green-leaf" />
          Photo Gallery Attachments
        </h3>
        <p className="text-xs text-slate-500">
          Add photo URLs that will be displayed in this story’s high-resolution lightbox gallery.
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            placeholder="Paste image URL (from Supabase Media Library or external)..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
          />
          <button
            type="button"
            onClick={handleAddGalleryImage}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            Add to Gallery
          </button>
        </div>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs"
              >
                <Image
                  src={imgUrl}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
