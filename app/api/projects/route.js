import { GetAllProjectData } from "../../utils/GetData";

export async function GET() {
  return Response.json(await GetAllProjectData());
}
