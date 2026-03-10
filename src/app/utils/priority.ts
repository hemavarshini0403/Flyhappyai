/**
 * Priority Prediction Module
 * Predicts urgency level based on complaint type, keywords, and sentiment
 * Uses rule-based logic to simulate ML-based priority prediction
 */

import { ComplaintCategory } from "./classifier";

export type PriorityLevel = "low" | "medium" | "high";
export type EmergencyLevel = 1 | 2 | 3 | 4 | 5;

interface PriorityResult {
  priority: PriorityLevel;
  score: number;
  factors: string[];
}

const highPriorityKeywords = [
  "urgent",
  "emergency",
  "medical",
  "health",
  "immediate",
  "asap",
  "critical",
  "danger",
  "theft",
  "lost passport",
  "stranded",
];

const mediumPriorityKeywords = [
  "important",
  "need",
  "required",
  "soon",
  "waiting",
  "delayed",
  "cancelled",
];

const categoryPriority: Record<ComplaintCategory, number> = {
  cancellation: 3, // High priority
  overbooking: 3,
  delay: 2, // Medium priority
  baggage: 2,
  refund: 2,
  staff_behaviour: 1, // Lower priority
  seat_issue: 1,
  food_issue: 1,
  service_issue: 1,
  other: 1,
};

/**
 * Predict priority level for a complaint
 */
export function predictPriority(
  description: string,
  category: ComplaintCategory,
  daysWaiting?: number,
  emergencyLevel: EmergencyLevel = 3
): PriorityResult {
  const text = description.toLowerCase();
  let score = 0;
  const factors: string[] = [];

  // Factor 1: Category-based priority
  const categoryScore = categoryPriority[category];
  score += categoryScore;
  if (categoryScore >= 3) {
    factors.push(`Critical category: ${category}`);
  }

  // Factor 2: High priority keywords
  highPriorityKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      score += 2;
      factors.push(`Urgent keyword: "${keyword}"`);
    }
  });

  // Factor 3: Medium priority keywords
  mediumPriorityKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      score += 0.5;
    }
  });

  // Factor 4: Time elapsed (if provided)
  if (daysWaiting !== undefined) {
    if (daysWaiting > 7) {
      score += 2;
      factors.push(`Waiting for ${daysWaiting} days`);
    } else if (daysWaiting > 3) {
      score += 1;
    }
  }

  // Factor 5: User-selected emergency level
  if (emergencyLevel >= 5) {
    score += 3;
    factors.push("Marked as very important by passenger");
  } else if (emergencyLevel === 4) {
    score += 1.5;
    factors.push("Marked as high urgency by passenger");
  } else if (emergencyLevel === 3) {
    score += 0.5;
  }

  // Factor 6: Sentiment analysis (simplified - check for negative words)
  const negativeWords = [
    "horrible",
    "terrible",
    "worst",
    "disgusting",
    "unacceptable",
    "frustrated",
    "angry",
    "furious",
  ];
  negativeWords.forEach((word) => {
    if (text.includes(word)) {
      score += 0.5;
      factors.push("High negative sentiment detected");
    }
  });

  // Determine priority level based on score
  let priority: PriorityLevel;
  if (score >= 4) {
    priority = "high";
  } else if (score >= 2) {
    priority = "medium";
  } else {
    priority = "low";
  }

  return {
    priority,
    score,
    factors: factors.slice(0, 3), // Top 3 factors
  };
}

export function getEmergencyLevelLabel(level: EmergencyLevel): string {
  const labels: Record<EmergencyLevel, string> = {
    1: "Low",
    2: "Moderate",
    3: "Important",
    4: "High",
    5: "Very Important",
  };

  return labels[level];
}

export function getEmergencyLevelBadgeColor(level: EmergencyLevel): string {
  const colors: Record<EmergencyLevel, string> = {
    1: "bg-green-500",
    2: "bg-lime-500",
    3: "bg-amber-500",
    4: "bg-orange-500",
    5: "bg-red-600",
  };

  return colors[level];
}

/**
 * Get color class for priority level
 */
export function getPriorityColor(priority: PriorityLevel): string {
  const colors = {
    high: "text-red-600 bg-red-50 border-red-200",
    medium: "text-orange-600 bg-orange-50 border-orange-200",
    low: "text-green-600 bg-green-50 border-green-200",
  };
  return colors[priority];
}

/**
 * Get badge color for priority level
 */
export function getPriorityBadgeColor(priority: PriorityLevel): string {
  const colors = {
    high: "bg-red-600",
    medium: "bg-orange-500",
    low: "bg-green-500",
  };
  return colors[priority];
}
