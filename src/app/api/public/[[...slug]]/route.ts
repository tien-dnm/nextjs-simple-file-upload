import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
export async function GET(
  res: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  if (params.slug && params.slug.length) {
    const publicDir = path.join(process.cwd(), "public");
    const fileUrl = path.join(...params.slug);
    const fullPath = path.join(publicDir, fileUrl);
    try {
      const data = fs.readFileSync(fullPath);
      return new NextResponse(data, {
        status: 200,
      });
    } catch {
      return new NextResponse(null, {
        status: 400,
      });
    }
  } else {
    return new NextResponse(null, {
      status: 400,
    });
  }
}
