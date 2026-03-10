/**
 * AI Complaint Classifier - Simulates ML-based complaint categorization
 * Uses keyword matching and NLP-like logic to classify complaints
 * In production, this would use a trained TF-IDF + Logistic Regression model
 */

export type ComplaintCategory =
  | "delay"
  | "cancellation"
  | "baggage"
  | "refund"
  | "staff_behaviour"
  | "seat_issue"
  | "food_issue"
  | "overbooking"
  | "service_issue"
  | "other";

export interface ClassificationResult {
  category: ComplaintCategory;
  confidence: number;
  keywords: string[];
}

const categoryKeywords: Record<ComplaintCategory, string[]> = {
  delay: ["delay", "late", "delayed", "waiting", "wait", "time", "hours", "postponed"],
  cancellation: ["cancel", "cancelled", "cancellation", "stopped", "not flying"],
  baggage: ["baggage", "luggage", "bag", "lost", "missing", "damaged", "suitcase"],
  refund: ["refund", "money", "payment", "reimbursement", "compensation", "amount", "paid"],
  staff_behaviour: ["staff", "rude", "behaviour", "attitude", "employee", "crew", "hostess", "pilot"],
  seat_issue: ["seat", "seating", "chair", "uncomfortable", "broken", "recline"],
  food_issue: ["food", "meal", "beverage", "drink", "snack", "quality", "stale"],
  overbooking: ["overbook", "no seat", "full", "oversold", "bumped"],
  service_issue: ["service", "poor", "bad", "cleanliness", "dirty", "maintenance"],
  other: ["other", "issue", "problem", "complaint"],
};

/**
 * Classify complaint text into predefined categories
 * Simulates ML model prediction using keyword matching
 */
export function classifyComplaint(description: string): ClassificationResult {
  const text = description.toLowerCase();
  const scores: Record<ComplaintCategory, number> = {
    delay: 0,
    cancellation: 0,
    baggage: 0,
    refund: 0,
    staff_behaviour: 0,
    seat_issue: 0,
    food_issue: 0,
    overbooking: 0,
    service_issue: 0,
    other: 0,
  };

  // Count keyword matches for each category
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        scores[category as ComplaintCategory] += 1;
      }
    });
  });

  // Find category with highest score
  let maxScore = 0;
  let bestCategory: ComplaintCategory = "other";
  const foundKeywords: string[] = [];

  Object.entries(scores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category as ComplaintCategory;
    }
  });

  // Find matching keywords for best category
  if (bestCategory !== "other") {
    categoryKeywords[bestCategory].forEach((keyword) => {
      if (text.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });
  }

  // Calculate confidence (0-1 scale)
  const confidence = Math.min(0.95, 0.6 + maxScore * 0.1);

  return {
    category: bestCategory,
    confidence: confidence,
    keywords: foundKeywords.slice(0, 3), // Top 3 keywords
  };
}

/**
 * Get display name for complaint category
 */
export function getCategoryDisplayName(category: ComplaintCategory): string {
  const names: Record<ComplaintCategory, string> = {
    delay: "Flight Delay",
    cancellation: "Flight Cancellation",
    baggage: "Baggage Issue",
    refund: "Refund Request",
    staff_behaviour: "Staff Behaviour",
    seat_issue: "Seat Issue",
    food_issue: "Food/Beverage Issue",
    overbooking: "Overbooking",
    service_issue: "Service Issue",
    other: "Other",
  };
  return names[category];
}
