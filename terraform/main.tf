# Main Terraform configuration for Video Streaming Platform

provider "aws" {
  region = var.aws_region
}

# Create a VPC and networking components
module "networking" {
  source      = "./modules/networking"
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

# Create S3 bucket for video storage and CloudFront distribution
module "storage" {
  source      = "./modules/storage"
  project_name = var.project_name
  environment  = var.environment
}

# Create CloudFront distribution for content delivery
module "cdn" {
  source          = "./modules/cdn"
  project_name     = var.project_name
  environment      = var.environment
  s3_bucket_domain = module.storage.s3_bucket_domain
  s3_bucket_arn    = module.storage.s3_bucket_arn
  s3_bucket_id     = module.storage.s3_bucket_id
}

# Create RDS PostgreSQL database
module "database" {
  source        = "./modules/database"
  project_name   = var.project_name
  environment    = var.environment
  vpc_id         = module.networking.vpc_id
  subnet_ids     = module.networking.private_subnet_ids
  # Use the security group from the networking module instead of creating a circular dependency
  ecs_security_group_id = module.networking.ecs_tasks_security_group_id
}

# Create ECR repositories for Docker images
module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
  environment  = var.environment
}

# Create ECS Fargate cluster and services for API, landing page, and admin panel
module "api" {
  source           = "./modules/api"
  project_name     = var.project_name
  environment      = var.environment
  vpc_id           = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
  db_endpoint      = module.database.db_endpoint
  db_name          = module.database.db_name
  db_username      = module.database.db_username
  db_password      = module.database.db_password
  db_secret_arn    = module.database.db_secret_arn
  s3_bucket_name   = module.storage.s3_bucket_name
  cloudfront_domain = module.cdn.cloudfront_domain
  api_image        = module.ecr.api_repository_url
  landing_page_image = module.ecr.landing_page_repository_url
  admin_panel_image = module.ecr.admin_panel_repository_url
}
