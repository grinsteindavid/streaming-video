# Variables for the database module

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "IDs of the subnets for the database"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "ID of the ECS security group"
  type        = string
  default     = ""
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "videostreaming"
}

variable "db_username" {
  description = "Username for the database"
  type        = string
  default     = "postgres"
}

variable "db_instance_class" {
  description = "Instance class for the database"
  type        = string
  default     = "db.t4g.small"
}

variable "db_allocated_storage" {
  description = "Allocated storage for the database in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for the database in GB"
  type        = number
  default     = 100
}
