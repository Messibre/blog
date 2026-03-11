import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();

    const posts = await Post.find({}).sort({ date: -1 }).lean();

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

    const body = await request.json();
    const { title, content, slug, date } = body;

    // Validate required fields
    if (!title || !content || !slug) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, content, and slug are required",
        },
        { status: 400 },
      );
    }

    // Create the post
    const post = await Post.create({
      title,
      content,
      slug,
      date: date ? new Date(date) : new Date(),
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
