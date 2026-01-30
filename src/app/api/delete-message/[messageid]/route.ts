import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ messageid: string }> }
) {
  const { messageid } = await context.params; // <-- MUST await

  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  try {
    const result = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { message: { _id: messageid } } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message Deleted" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting message" }),
      { status: 500 }
    );
  }
}
