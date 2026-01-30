import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const { messageid } = params; // no await!
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  if (!session || !user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { message: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
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
    console.error("Error in delete message route", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting message" }),
      { status: 500 }
    );
  }
}
