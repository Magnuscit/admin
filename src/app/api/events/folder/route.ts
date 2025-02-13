import { NextRequest, NextResponse } from "next/server";

export const revalidate = 1;
export async function GET(_: NextRequest) {
  const json = await fetch( "https://raw.githubusercontent.com/Magnuscit/events-data-25/refs/heads/master/info.json",);
  const res = await json.json();
  return NextResponse.json(res);
}
