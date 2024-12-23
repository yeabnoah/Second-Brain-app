import prisma from "@/lib/prisma";
import getUserSession from "@/util/getUserData";
import { ContentInterface } from "@/validation/contentSchema";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";

export const GET = async () => {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "you are not authorized",
        error: "authentication",
        data: null,
      });
    }

    const allContents = await prisma.content.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "data fetched successfully",
      error: null,
      data: allContents,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "unknown error happened",
      error: error,
      data: null,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "you are not authorized",
        error: "authentication",
        data: null,
      });
    }

    const newContent = {
      title: body.title,
      link: body.link,
      type: body.type,
      tags: body.tags,
      userId: session.user.id,
    };

    const createdContent = await prisma.content.create({
      data: newContent,
    });

    return NextResponse.json({
      success: true,
      message: "successfully created a content",
      error: null,
      data: createdContent,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "unknown error happened",
      error: error,
      data: null,
    });
  }
};
