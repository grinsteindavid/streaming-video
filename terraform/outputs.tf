# Outputs for the Video Streaming Platform Terraform configuration

output "cloudfront_domain" {
  description = "CloudFront distribution domain name for video content delivery"
  value       = module.cdn.cloudfront_domain
}

output "api_url" {
  description = "URL for the Video Streaming API"
  value       = module.api.api_url
}

output "landing_page_url" {
  description = "URL for the landing page"
  value       = module.api.landing_page_url
}

output "admin_panel_url" {
  description = "URL for the admin panel"
  value       = module.api.admin_panel_url
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for video storage"
  value       = module.storage.s3_bucket_name
}
