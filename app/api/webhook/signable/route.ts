import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	// Get the body
	console.log(req.body)

	// Based on response update db record of customer

	return new Response("", { status: 200 });
}