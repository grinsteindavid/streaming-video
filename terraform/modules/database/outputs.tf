# Outputs for the database module

output "db_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_name" {
  description = "Name of the database"
  value       = aws_db_instance.main.db_name
}

output "db_username" {
  description = "Username for the database"
  value       = aws_db_instance.main.username
}

output "db_password" {
  description = "Password for the database"
  value       = random_password.db_password.result
  sensitive   = true
}

output "db_security_group_id" {
  description = "ID of the database security group"
  value       = aws_security_group.rds.id
}

output "db_secret_arn" {
  description = "ARN of the secret containing database credentials"
  value       = aws_secretsmanager_secret.db_password.arn
}
