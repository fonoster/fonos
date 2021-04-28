import routr from "../common/routr";
import { GetResourceRequest } from "./types";

export default async function getResource(request: GetResourceRequest): Promise<Object> {
  await routr.connect();
  const jsonObj = await routr.resourceType(`${request.kind.toLowerCase()}s`)
    .get(request.ref);
  // Return only if exist and is the owner of the resource
  return jsonObj && jsonObj.metadata.accessKeyId === request.accessKeyId
    ? jsonObj
    : null;
}
