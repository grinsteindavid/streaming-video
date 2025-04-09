# Outputs for the ECR module

output "api_repository_url" {
  description = "URL of the API ECR repository"
  value       = aws_ecr_repository.api.repository_url
}

output "landing_page_repository_url" {
  description = "URL of the landing page ECR repository"
  value       = aws_ecr_repository.landing_page.repository_url
}

output "admin_panel_repository_url" {
  description = "URL of the admin panel ECR repository"
  value       = aws_ecr_repository.admin_panel.repository_url
}
