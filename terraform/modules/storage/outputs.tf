# Outputs for the storage module

output "s3_bucket_name" {
  description = "Name of the S3 bucket for video storage"
  value       = aws_s3_bucket.video_storage.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for video storage"
  value       = aws_s3_bucket.video_storage.arn
}

output "s3_bucket_domain" {
  description = "Domain name of the S3 bucket for video storage"
  value       = aws_s3_bucket.video_storage.bucket_regional_domain_name
}

output "s3_bucket_id" {
  description = "ID of the S3 bucket for video storage"
  value       = aws_s3_bucket.video_storage.id
}
