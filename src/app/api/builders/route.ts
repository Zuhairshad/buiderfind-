import { ObjectId } from "mongodb";
import { collections } from "@/lib/db/collections";
import { geocodePostcode } from "@/lib/location/postcodes";
import { jsonError } from "@/lib/http/api";

const TRADE_LABELS: Record<string, string> = {
  builders: "Builder / General", plumbers: "Plumber", electricians: "Electrician", roofers: "Roofer", plasterers: "Plasterer",
  painters: "Painter & Decorator", carpenters: "Carpenter / Joiner", tilers: "Tiler", flooring: "Flooring Specialist",
  gardeners: "Gardener / Landscaper", handymen: "Handyman", heating: "Heating Engineer", bathrooms: "Bathroom Fitter",
  kitchens: "Kitchen Fitter", windows: "Window Fitter", driveways: "Driveway Specialist", extensions: "Extension Specialist", drainage: "Drainage",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const trade = url.searchParams.get("trade")?.trim().toLowerCase();
    const postcode = url.searchParams.get("postcode")?.trim();
    const cursor = url.searchParams.get("cursor");
    const c = await collections();
    const filter: Record<string, unknown> = { verificationStatus: "verified", profileVisible: true };
    if (trade) filter.trades = TRADE_LABELS[trade] ?? trade;
    if (cursor && ObjectId.isValid(cursor)) filter._id = { $lt: new ObjectId(cursor) };
    const location = postcode ? await geocodePostcode(postcode) : undefined;
    if (location) filter.location = { $near: { $geometry: location, $maxDistance: 80_467 } };
    const profiles = await c.builderProfiles.find(filter).sort(location ? {} : { featuredUntil: -1, ratingAverage: -1, _id: -1 }).limit(20).toArray();
    const users = await c.users.find({ _id: { $in: profiles.map((profile) => profile.userId) }, status: "active" }, { projection: { firstName: 1, lastName: 1 } }).toArray();
    const names = new Map(users.map((user) => [user._id.toHexString(), `${user.firstName} ${user.lastName}`]));
    return Response.json({
      builders: profiles.filter((profile) => names.has(profile.userId.toHexString())).map((profile) => ({
        id: profile._id.toHexString(), slug: profile.slug, name: names.get(profile.userId.toHexString()), company: profile.businessName,
        area: profile.basePostcode, rating: profile.ratingAverage, reviews: profile.reviewCount, years: profile.yearsExperience,
        verified: true, featured: Boolean(profile.featuredUntil && profile.featuredUntil > new Date()), bio: profile.bio, services: profile.services,
      })),
      nextCursor: profiles.at(-1)?._id.toHexString() ?? null,
    });
  } catch (error) { return jsonError(error); }
}
