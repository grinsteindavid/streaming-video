# Storage module for Video Streaming Platform

# Create S3 bucket for video storage
resource "aws_s3_bucket" "video_storage" {
  bucket = "${var.project_name}-${var.environment}-videos-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "${var.project_name}-${var.environment}-videos"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Generate random suffix for globally unique S3 bucket name
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Configure bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "video_storage" {
  bucket = aws_s3_bucket.video_storage.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Configure bucket ACL
resource "aws_s3_bucket_acl" "video_storage" {
  bucket = aws_s3_bucket.video_storage.id
  acl    = "private"
  depends_on = [aws_s3_bucket_ownership_controls.video_storage]
}

# Configure bucket CORS policy
resource "aws_s3_bucket_cors_configuration" "video_storage" {
  bucket = aws_s3_bucket.video_storage.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"] # In production, restrict to your domains
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Create folders in S3 bucket to organize content
resource "aws_s3_object" "videos_folder" {
  bucket  = aws_s3_bucket.video_storage.id
  key     = "videos/"
  content_type = "application/x-directory"
  content = ""
}

resource "aws_s3_object" "thumbnails_folder" {
  bucket  = aws_s3_bucket.video_storage.id
  key     = "thumbnails/"
  content_type = "application/x-directory"
  content = ""
}

resource "aws_s3_object" "subtitles_folder" {
  bucket  = aws_s3_bucket.video_storage.id
  key     = "subtitles/"
  content_type = "application/x-directory"
  content = ""
}

resource "aws_s3_object" "hls_folder" {
  bucket  = aws_s3_bucket.video_storage.id
  key     = "hls/"
  content_type = "application/x-directory"
  content = ""
}

# Create bucket policy to allow CloudFront access
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.video_storage.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [var.cloudfront_distribution_arn != "" ? var.cloudfront_distribution_arn : "*"]
    }
  }
}

# Apply bucket policy if CloudFront distribution ARN is provided
resource "aws_s3_bucket_policy" "video_storage" {
  count  = var.cloudfront_distribution_arn != "" ? 1 : 0
  bucket = aws_s3_bucket.video_storage.id
  policy = data.aws_iam_policy_document.s3_policy.json
}
