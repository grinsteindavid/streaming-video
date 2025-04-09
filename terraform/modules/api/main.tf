# API module for Video Streaming Platform

# Create ECS cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cluster"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create CloudWatch log groups for each service
resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/${var.project_name}-${var.environment}-api"
  retention_in_days = 30

  tags = {
    Name        = "${var.project_name}-${var.environment}-api-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_log_group" "landing_page" {
  name              = "/ecs/${var.project_name}-${var.environment}-landing-page"
  retention_in_days = 30

  tags = {
    Name        = "${var.project_name}-${var.environment}-landing-page-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_log_group" "admin_panel" {
  name              = "/ecs/${var.project_name}-${var.environment}-admin-panel"
  retention_in_days = 30

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-panel-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create security group for ECS tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-${var.environment}-ecs-tasks-sg"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [var.alb_security_group_id]
    description     = "Allow all inbound traffic from ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-tasks-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create IAM role for ECS task execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-${var.environment}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-task-execution-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach policies to ECS task execution role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_secrets_manager_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.secrets_manager_access.arn
}

# Create IAM policy for Secrets Manager access
resource "aws_iam_policy" "secrets_manager_access" {
  name        = "${var.project_name}-${var.environment}-secrets-manager-access"
  description = "Policy for accessing Secrets Manager secrets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "secretsmanager:GetSecretValue",
        ]
        Effect   = "Allow"
        Resource = var.db_secret_arn
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-secrets-manager-access"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create IAM role for ECS task
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-task-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach policies to ECS task role
resource "aws_iam_role_policy_attachment" "ecs_task_s3_access" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.s3_access.arn
}

# Create IAM policy for S3 access
resource "aws_iam_policy" "s3_access" {
  name        = "${var.project_name}-${var.environment}-s3-access"
  description = "Policy for accessing S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*"
        ]
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-s3-access"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = var.environment == "prod"

  tags = {
    Name        = "${var.project_name}-${var.environment}-alb"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create ALB target groups
resource "aws_lb_target_group" "api" {
  name        = "${var.project_name}-${var.environment}-api-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/health-check"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-api-tg"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_lb_target_group" "landing_page" {
  name        = "${var.project_name}-${var.environment}-landing-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-landing-tg"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_lb_target_group" "admin_panel" {
  name        = "${var.project_name}-${var.environment}-admin-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-tg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create ALB listeners
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn != "" ? var.certificate_arn : null

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.landing_page.arn
  }

  # Use default certificate if none provided
  dynamic "default_action" {
    for_each = var.certificate_arn == "" ? [1] : []
    content {
      type = "fixed-response"

      fixed_response {
        content_type = "text/plain"
        message_body = "Please configure SSL certificate"
        status_code  = "503"
      }
    }
  }
}

# Create ALB listener rules
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

resource "aws_lb_listener_rule" "admin_panel" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin_panel.arn
  }

  condition {
    path_pattern {
      values = ["/admin/*"]
    }
  }
}

# Create ECS task definitions
resource "aws_ecs_task_definition" "api" {
  family                   = "${var.project_name}-${var.environment}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.api_cpu
  memory                   = var.api_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = var.api_image
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "ASPNETCORE_ENVIRONMENT", value = var.environment },
        { name = "DB_CONNECTION_STRING", value = "Host=${var.db_endpoint};Database=${var.db_name};Username=${var.db_username};Password=${var.db_password}" },
        { name = "STORAGE_PATH", value = "/app/videos" },
        { name = "S3_BUCKET_NAME", value = var.s3_bucket_name },
        { name = "CLOUDFRONT_DOMAIN", value = var.cloudfront_domain }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.api.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-${var.environment}-api-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_task_definition" "landing_page" {
  family                   = "${var.project_name}-${var.environment}-landing-page"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.landing_page_cpu
  memory                   = var.landing_page_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "landing-page"
      image     = var.landing_page_image
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "API_URL", value = "https://${aws_lb.main.dns_name}/api" },
        { name = "CLOUDFRONT_DOMAIN", value = var.cloudfront_domain }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.landing_page.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-${var.environment}-landing-page-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_task_definition" "admin_panel" {
  family                   = "${var.project_name}-${var.environment}-admin-panel"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.admin_panel_cpu
  memory                   = var.admin_panel_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "admin-panel"
      image     = var.admin_panel_image
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "API_URL", value = "https://${aws_lb.main.dns_name}/api" },
        { name = "CLOUDFRONT_DOMAIN", value = var.cloudfront_domain }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.admin_panel.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-panel-task"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create ECS services
resource "aws_ecs_service" "api" {
  name                               = "${var.project_name}-${var.environment}-api"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.api.arn
  desired_count                      = var.api_desired_count
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"
  health_check_grace_period_seconds  = 60

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = var.private_subnet_ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8080
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [aws_lb_listener.https]

  tags = {
    Name        = "${var.project_name}-${var.environment}-api-service"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_service" "landing_page" {
  name                               = "${var.project_name}-${var.environment}-landing-page"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.landing_page.arn
  desired_count                      = var.landing_page_desired_count
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"
  health_check_grace_period_seconds  = 60

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = var.private_subnet_ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.landing_page.arn
    container_name   = "landing-page"
    container_port   = 80
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [aws_lb_listener.https]

  tags = {
    Name        = "${var.project_name}-${var.environment}-landing-page-service"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_service" "admin_panel" {
  name                               = "${var.project_name}-${var.environment}-admin-panel"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.admin_panel.arn
  desired_count                      = var.admin_panel_desired_count
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"
  health_check_grace_period_seconds  = 60

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = var.private_subnet_ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.admin_panel.arn
    container_name   = "admin-panel"
    container_port   = 80
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [aws_lb_listener.https]

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-panel-service"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create Auto Scaling for ECS services
resource "aws_appautoscaling_target" "api" {
  max_capacity       = var.api_max_count
  min_capacity       = var.api_min_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "${var.project_name}-${var.environment}-api-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "api_memory" {
  name               = "${var.project_name}-${var.environment}-api-memory-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
