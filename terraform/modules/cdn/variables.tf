# Variables for the CDN module

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "s3_bucket_domain" {
  description = "Domain name of the S3 bucket for video storage"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket for video storage"
  type        = string
}

variable "s3_bucket_id" {
  description = "ID of the S3 bucket for video storage"
  type        = string
}
