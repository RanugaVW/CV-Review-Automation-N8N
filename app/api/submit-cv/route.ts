import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: "N8N webhook URL not configured" },
        { status: 500 },
      );
    }

    // Forward the multipart form data to n8n
    const n8nFormData = new FormData();

    const name = formData.get("Name") as string;
    const email = formData.get("Email") as string;
    const cvFile = formData.get("CV") as File;
    const jobId = formData.get("jobId") as string;

    if (!name || !email || !cvFile) {
      return NextResponse.json(
        { error: "Name, Email, and CV are required" },
        { status: 400 },
      );
    }

    n8nFormData.append("Name", name);
    n8nFormData.append("Email", email);
    n8nFormData.append("CV", cvFile, cvFile.name);
    n8nFormData.append("jobId", jobId || "default-job");

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("n8n error:", response.status, text);
      return NextResponse.json(
        { error: `n8n returned ${response.status}` },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "CV submitted successfully",
    });
  } catch (error) {
    console.error("Submit CV error:", error);
    return NextResponse.json(
      { error: "Failed to submit CV. Please try again." },
      { status: 500 },
    );
  }
}
