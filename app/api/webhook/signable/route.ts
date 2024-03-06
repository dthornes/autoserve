import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "@/logger";

export async function GET(req: Request) {
	// Get the body
	logger.info("Webhook test: ", req.body);

	// Based on response update db record of customer

	return new Response("", { status: 200 });
}