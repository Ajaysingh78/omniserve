export interface ICreateReviewRequest {
  outletId: string;
  source: string;
  reviewText?: string;
  sentimentScore?: number;
  rating?: number;
  reviewDate?: string;
  externalReviewId?: string;
}

export interface IQueryReviews {
  outletId?: string;
  source?: string;
  sentimentLabel?: string;
  rating?: string;
  page?: string;
  limit?: string;
}
