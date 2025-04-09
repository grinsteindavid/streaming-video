# Outputs for the API module

output "api_url" {
  description = "URL for the Video Streaming API"
  value       = "https://${aws_lb.main.dns_name}/api"
}

output "landing_page_url" {
  description = "URL for the landing page"
  value       = "https://${aws_lb.main.dns_name}"
}

output "admin_panel_url" {
  description = "URL for the admin panel"
  value       = "https://${aws_lb.main.dns_name}/admin"
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "api_service_name" {
  description = "Name of the API ECS service"
  value       = aws_ecs_service.api.name
}

output "landing_page_service_name" {
  description = "Name of the landing page ECS service"
  value       = aws_ecs_service.landing_page.name
}

output "admin_panel_service_name" {
  description = "Name of the admin panel ECS service"
  value       = aws_ecs_service.admin_panel.name
}
