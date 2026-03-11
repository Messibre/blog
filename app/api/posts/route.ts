import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(50000, "Content is too long"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  date: z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  }, z.date().optional()),
});

export async function GET() {
  try {
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();

    const posts = await Post.find({}).sort({ date: -1 }).lean();

    if (!Array.isArray(posts)) {
      console.error("Unexpected posts result", posts);
      return NextResponse.json(
        { error: "Unexpected data format from database" },
        { status: 500 },
      );
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error?.message },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create a new post (protected with API key)
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const adminSecretKey = process.env.ADMIN_SECRET_KEY;

  if (!adminSecretKey) {
    return NextResponse.json(
      { error: "Server configuration error: ADMIN_SECRET_KEY not set" },
      { status: 500 },
    );
  }

  if (!apiKey || apiKey !== adminSecretKey) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing API key" },
      { status: 401 },
    );
  }

  try {
    // dynamically load to avoid bundler issues
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = postInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, content, slug, date } = parsed.data;

    // Create the post
    const post = await Post.create({
      title,
      content,
      slug: slug.toLowerCase(),
      date: date ?? new Date(),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);

    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
