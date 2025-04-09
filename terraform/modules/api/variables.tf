# Variables for the API module

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of the public subnets"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
  default     = ""
}

variable "db_endpoint" {
  description = "Endpoint of the RDS instance"
  type        = string
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "db_username" {
  description = "Username for the database"
  type        = string
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "db_secret_arn" {
  description = "ARN of the secret containing database credentials"
  type        = string
  default     = ""
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for video storage"
  type        = string
}

variable "cloudfront_domain" {
  description = "Domain name of the CloudFront distribution"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate for HTTPS"
  type        = string
  default     = ""
}

variable "api_image" {
  description = "Docker image for the API service"
  type        = string
  default     = "your-account-id.dkr.ecr.us-east-1.amazonaws.com/video-streaming-api:latest"
}

variable "landing_page_image" {
  description = "Docker image for the landing page service"
  type        = string
  default     = "your-account-id.dkr.ecr.us-east-1.amazonaws.com/video-streaming-landing:latest"
}

variable "admin_panel_image" {
  description = "Docker image for the admin panel service"
  type        = string
  default     = "your-account-id.dkr.ecr.us-east-1.amazonaws.com/video-streaming-admin:latest"
}

variable "api_cpu" {
  description = "CPU units for the API service"
  type        = string
  default     = "512"
}

variable "api_memory" {
  description = "Memory for the API service"
  type        = string
  default     = "1024"
}

variable "landing_page_cpu" {
  description = "CPU units for the landing page service"
  type        = string
  default     = "256"
}

variable "landing_page_memory" {
  description = "Memory for the landing page service"
  type        = string
  default     = "512"
}

variable "admin_panel_cpu" {
  description = "CPU units for the admin panel service"
  type        = string
  default     = "256"
}

variable "admin_panel_memory" {
  description = "Memory for the admin panel service"
  type        = string
  default     = "512"
}

variable "api_desired_count" {
  description = "Desired number of API tasks"
  type        = number
  default     = 2
}

variable "api_min_count" {
  description = "Minimum number of API tasks"
  type        = number
  default     = 2
}

variable "api_max_count" {
  description = "Maximum number of API tasks"
  type        = number
  default     = 10
}

variable "landing_page_desired_count" {
  description = "Desired number of landing page tasks"
  type        = number
  default     = 2
}

variable "admin_panel_desired_count" {
  description = "Desired number of admin panel tasks"
  type        = number
  default     = 2
}
