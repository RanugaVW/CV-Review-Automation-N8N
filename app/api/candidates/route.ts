import { NextResponse } from "next/server";

// Mock candidate data — replace with Google Sheets API call for live data
export async function GET() {
  try {
    const n8nUrl = process.env.N8N_FETCH_CANDIDATES_URL;
    
    if (!n8nUrl) {
      throw new Error("N8N_FETCH_CANDIDATES_URL is not defined");
    }

    const response = await fetch(n8nUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }

    const rawData = await response.json();
    
    const candidates = rawData.map((item: any, index: number) => ({
      id: String(index + 1),
      date: item["DATA"] || "",
      name: item["NAME"] || "",
      email: item["EMAIL"] || "",
      city: item["CITY"] || "",
      skills: item["SKILLS"] || "",
      educational: item["EDUCATIONAL"] || "",
      jobHistory: item["JOB HISTORY"] || "",
      summarize: item["SUMMARIZE"] || "",
      vote: item["VOTE"] || "0",
      consideration: item["CONSIDERATION"] || "",
    }));

    const votes = candidates.map((c: any) => parseInt(c.vote) || 0);
    const avgVote = votes.length > 0 
      ? (votes.reduce((a: number, b: number) => a + b, 0) / votes.length).toFixed(1)
      : "0.0";
    
    const topCandidates = candidates.filter(
      (c: any) => (parseInt(c.vote) || 0) >= 7,
    ).length;

    return NextResponse.json({
      candidates,
      stats: {
        total: candidates.length,
        avgVote,
        topCandidates,
        pending: 0,
      },
    });
  } catch (error) {
    console.error("Candidates fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates from live source" },
      { status: 500 },
    );
  }
}
