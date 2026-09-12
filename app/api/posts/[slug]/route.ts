import { NextRequest, NextResponse } from "next/server";

// GET /api/posts/[slug] - Fetch a single post by its slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();

    const post = await Post.findOne({ slug: slug.toLowerCase() }).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post", details: error?.message },
      { status: 500 },
    );
  }
}
