import React from 'react';
import Icon from '../../../components/AppIcon';

const RatingsReviewsTab = ({ data }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 })?.map((_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const renderRatingBar = (category, rating) => {
    const percentage = (rating / 5) * 100;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{category}</span>
          <span className="text-muted-foreground">{rating}/5</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Rating Card */}
      <div className="card p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {data?.overallRating}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {renderStars(data?.overallRating)}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {data?.totalReviews} reviews
          </p>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Rating Breakdown
        </h3>
        <div className="space-y-4">
          {renderRatingBar('Punctuality', data?.categoryRatings?.punctuality)}
          {renderRatingBar('Work Quality', data?.categoryRatings?.quality)}
          {renderRatingBar('Communication', data?.categoryRatings?.communication)}
          {renderRatingBar('Professionalism', data?.categoryRatings?.professionalism)}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={20} />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {data?.performanceMetrics?.attendancePercentage}%
            </div>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {data?.performanceMetrics?.jobCompletionRate}%
            </div>
            <p className="text-sm text-muted-foreground">Job Completion</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {data?.performanceMetrics?.punctualityScore}
            </div>
            <p className="text-sm text-muted-foreground">Punctuality Score</p>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="MessageSquare" size={20} />
          Recent Reviews
        </h3>
        <div className="space-y-4">
          {data?.recentReviews?.map((review) => (
            <div key={review?.id} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold mb-1">{review?.employerName}</div>
                  <div className="flex items-center gap-1">
                    {renderStars(review?.rating)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review?.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review?.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsReviewsTab;