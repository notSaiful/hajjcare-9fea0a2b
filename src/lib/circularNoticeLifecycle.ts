export type CircularReviewStatus =
  | "pending_review"
  | "verified"
  | "approved"
  | "published"
  | "rejected"
  | "unpublished"
  | "archived";

export type CircularReviewAction = "verify" | "publish" | "reject" | "archive";

export const REVIEW_STATUS_LABELS: Record<CircularReviewStatus | "draft" | "scheduled" | "unpublished" | "expired", string> = {
  pending_review: "Awaiting Admin Review",
  draft: "Awaiting Admin Review",
  verified: "Verified / Ready for Publication",
  approved: "Verified / Ready for Publication",
  published: "Published",
  rejected: "Rejected",
  unpublished: "Unpublished",
  archived: "Archived",
  scheduled: "Scheduled",
  expired: "Expired",
};

export function reviewStatusLabel(status: string | null | undefined, published = false) {
  if (published) return REVIEW_STATUS_LABELS.published;
  return REVIEW_STATUS_LABELS[status as CircularReviewStatus] || REVIEW_STATUS_LABELS.pending_review;
}

export function reviewActionPatch(action: CircularReviewAction) {
  switch (action) {
    case "verify":
      return { is_published: false, is_current_version: true, review_status: "verified" as const };
    case "publish":
      return { is_published: true, is_current_version: true, review_status: "published" as const };
    case "reject":
      return { is_published: false, is_current_version: true, review_status: "rejected" as const };
    case "archive":
      return { is_published: false, is_current_version: false, review_status: "archived" as const, status: "archived" as const };
  }
}

export function duplicateStatusLabel(duplicateCount: number, hasExternalId: boolean) {
  if (duplicateCount > 1) return "Duplicate detected";
  if (hasExternalId) return "No duplicate detected";
  return "No external ID; manual check required";
}
