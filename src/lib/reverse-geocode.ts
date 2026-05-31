export type ReverseGeocodeResult = {
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
};

type NominatimAddress = Record<string, string | undefined>;

function firstValue(address: NominatimAddress, keys: string[]) {
  for (const key of keys) {
    const value = address[key];
    if (value) return value;
  }

  return "";
}

function cleanAdministrativeName(value: string) {
  return value
    .replace(/^(kecamatan|kelurahan|desa|kabupaten|kota)\s+/i, "")
    .trim();
}

function extractRtRw(text: string) {
  const rtMatch = text.match(/\bRT[.\s-]*(\d{1,3})\b/i);
  const rwMatch = text.match(/\bRW[.\s-]*(\d{1,3})\b/i);

  return {
    rt: rtMatch?.[1] || "",
    rw: rwMatch?.[1] || "",
  };
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<ReverseGeocodeResult> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    lat: String(latitude),
    lon: String(longitude),
    zoom: "18",
    "accept-language": "id",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil data lokasi.");
  }

  const payload = (await response.json()) as {
    display_name?: string;
    address?: NominatimAddress;
  };
  const address = payload.address || {};
  const displayName = payload.display_name || "";
  const rtRw = extractRtRw(displayName);
  const road = firstValue(address, [
    "road",
    "pedestrian",
    "footway",
    "path",
    "residential",
  ]);
  const kelurahan = cleanAdministrativeName(
    firstValue(address, ["village", "suburb", "neighbourhood", "quarter"]),
  );
  const kecamatan = cleanAdministrativeName(
    firstValue(address, ["city_district", "district", "municipality", "county"]),
  );
  const city = cleanAdministrativeName(
    firstValue(address, ["city", "town", "regency", "county", "municipality"]),
  );

  return {
    address: road || displayName,
    rt: rtRw.rt,
    rw: rtRw.rw,
    kelurahan,
    kecamatan,
    city,
    province: firstValue(address, ["state", "region"]),
    postalCode: firstValue(address, ["postcode"]),
  };
}
