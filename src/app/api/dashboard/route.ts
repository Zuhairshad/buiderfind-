import { apiUser } from "@/lib/auth/api-auth";
import { getDashboardSnapshot } from "@/lib/marketplace/dashboard";
import { jsonError } from "@/lib/http/api";
export async function GET() { try { return Response.json(await getDashboardSnapshot(await apiUser())); } catch (error) { return jsonError(error); } }
