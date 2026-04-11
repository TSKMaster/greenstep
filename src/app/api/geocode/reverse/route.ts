import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  neighbourhood?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  house_number?: string;
  house_name?: string;
};

type NominatimReverseResponse = {
  address?: NominatimAddress;
  display_name?: string;
};

function formatReverseAddress(data: NominatimReverseResponse) {
  const address = data.address;

  if (!address) {
    return data.display_name ?? "";
  }

  const city =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.suburb ??
    address.neighbourhood;

  const street =
    address.road ??
    address.pedestrian ??
    address.footway ??
    address.neighbourhood;

  const building = address.house_number ?? address.house_name;
  const parts = [city, street, building].filter(
    (value): value is string => Boolean(value && value.trim()),
  );

  return parts.length > 0 ? parts.join(", ") : (data.display_name ?? "");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lng"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const upstreamUrl = new URL(NOMINATIM_REVERSE_URL);
  upstreamUrl.searchParams.set("format", "jsonv2");
  upstreamUrl.searchParams.set("lat", latitude.toFixed(6));
  upstreamUrl.searchParams.set("lon", longitude.toFixed(6));
  upstreamUrl.searchParams.set("zoom", "18");
  upstreamUrl.searchParams.set("addressdetails", "1");
  upstreamUrl.searchParams.set("accept-language", "ru");

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "GreenStep/0.1 (+https://greenstep.local)",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Reverse geocoding failed" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as NominatimReverseResponse;

    return NextResponse.json({
      address: formatReverseAddress(data),
    });
  } catch (error) {
    console.error("Reverse geocoding request failed", error);

    return NextResponse.json(
      { error: "Reverse geocoding request failed" },
      { status: 502 },
    );
  }
}
