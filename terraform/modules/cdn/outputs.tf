# Outputs for the CDN module

output "cloudfront_domain" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.video_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.video_distribution.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.video_distribution.arn
}
