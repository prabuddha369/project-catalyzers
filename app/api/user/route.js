import { auth } from "../../firebase";

export default async function GET() {
  const user = auth.currentUser;
  if (user) {
    return Response.json(user);
  } else {
    return Response.toString("Error getting user");
  }
}
